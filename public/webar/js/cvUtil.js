"use strict";

const nj = require('numjs');
const arucoUtil = require('./arucoUtil');
const AppActions = require('./actions/AppActions');

const UPDATE_EVERY = 10;

const FAR_PLANE= 1000;
const NEAR_PLANE= 0.01;
const MAX_SNAP = 10;
const THRESHOLD_ERROR = 2.5;
const SCALE_FACTOR = 2;//4;
const MINIMUM_GL_SIZE = 180;

const cv = require('../opencv');
const cvPromise = (function() {
    return new Promise((resolve, reject) => {
        cv.onRuntimeInitialized = () => {
            console.log('Init cv OK');
            resolve('Done');
        };
        cv.onAbort = (err) => {
            reject(err);
        };
    });
})();


const gl2cvProjMat = function(projMat, width, height) {

    console.log(projMat);

    var fX = projMat[0] * width / 2;
    var fY = Math.abs(projMat[5]*height / 2);
    var cX = (1- projMat[8]) * width / 2;
    var cY = (projMat[9] + 1) * height / 2;

    console.log('fX:' + fX + ' fY:' + fY + ' cX:' + cX + ' cY:' + cY);
    return cv.matFromArray(3, 3, cv.CV_64F,
                           [fX, 0, cX,
                            0, fY, cY,
                            0,  0,  1]);
};

const openGLProjMat = function(width, height, fX, fY, cX, cY, near, far) {
    return nj.array([
        [2* fX / width, 0, 1 - 2 * (cX/width), 0],
        [0, 2 * fY / height, 2*(cY/height) -1 , 0],
        [0, 0, -(far + near) / (far - near), -2 * far * near / (far - near)],
        [0, 0, -1, 0]
    ], 'float64')
        .transpose() // fortran order, i.e., column major
        .reshape(16)
        .tolist();
};

const gPixelGLProjMat = function(width, height) {
    const GPIXEL_F = 0.75;
    const VERTICAL_F = 1.0; // Fixed in 8thwall rel 12.0, no compression!
    /* 1.087; // image vertically compressed with aspect ratio*/
    // force fX== fY
    return openGLProjMat(width, height, GPIXEL_F * width, VERTICAL_F *
                         GPIXEL_F * width,
                         width/2, height/2, NEAR_PLANE, FAR_PLANE);
}

const openGLViewMat = function(rot, trans, isReversedXZ) {
    var rotMat = new cv.Mat(3, 3, cv.CV_64F);
    cv.Rodrigues(rot, rotMat);
    var r = nj.array(rotMat.data64F, 'float64').reshape(3, 3);
    var t = nj.array(trans.data64F, 'float64').reshape(3, 1);
    if (isReversedXZ) {
        // rotate global coordinates, translation vector the same
        var flipXZ = nj.array([-1, 0,  0,
                               0,  1,  0,
                               0,  0, -1], 'float64').reshape(3,3);
        r = nj.dot(r, flipXZ);
    }
    var flipAxis = nj.array([1,  0,  0,
                             0, -1,  0,
                             0,  0, -1], 'float64').reshape(3,3);
    // rotate destination coordinates, need to rotate translation vector
    r = nj.dot(flipAxis, r);
    t = nj.dot(flipAxis, t);
    var res = nj.concatenate(r, t);
    res = nj.concatenate(res.T, nj.array([0, 0, 0, 1],
                                         'float64').reshape(4,1)).T;
    rotMat.delete();
    return res
        .transpose() // fortran order, i.e., column major
        .reshape(16)
        .tolist();
};

const computeRemoteTarget = function(coordMapping, invMat) {
    /*
     * Until now we assumed that the coordinates of the remote target were
     * similar to the ones of "our" device, i.e.,  the one mapped by our CA.
     *
     * This is not always true, we can synchronize with a different device
     * pattern as long as 'our' device has calibrated with the other device.
     *
     * In that case there is a transformation matrix 'invMat' that maps
     * coordinates in our space to the remote device space.
     *
     * The mapping (from 'computeCoordMap') to actual 'phone'
     *  coordinate space from a remote coordinate space:
     *
     *  (X,Y,Z,1) =  A * (X'',Y'',Z'',1)
     *
     * and now we have (X'',Y'',Z'',1) = invMat * (X',Y',Z',1)
     *
     *  so the mapping to actual 'phone' coordinate space from our device
     * coordinate space is:
     *
     *    (X,Y,Z,1) =  A * invMat * (X',Y',Z',1)
     *
     *  and the new mapping is just A*invMat...
     */

    var p = nj.array(coordMapping, 'float32').reshape(4, 4).transpose();
    var q = nj.array(invMat, 'float32').reshape(4, 4).transpose();
    return nj.dot(p, q)
        .transpose() // fortran order, i.e., column major
        .reshape(16)
        .tolist();

};
const computeCoordMap = function(poseMat, viewMat) {

    /*
     * Assuming a similar projection matrix it should hold that:
     *         inverse(poseMat) * (X,Y,Z,1) = viewMat * (X',Y',Z',1)
     *     and therefore:
     *           (X,Y,Z,1) = (poseMat *viewMat)*(X',Y',Z',1) = A * (X',Y',Z',1)
     * and the matrix 'A' maps the model matrix of externally detected objects
     * to our global coordinate system.
     */
    var p = nj.array(poseMat, 'float32').reshape(4, 4).transpose();
    var q = nj.array(viewMat, 'float32').reshape(4, 4).transpose();
    return nj.dot(p, q)
        .transpose() // fortran order, i.e., column major
        .reshape(16)
        .tolist();
};

const norm2 = function(x) {
    var res = x.multiply(x).dot(nj.ones([x.shape[1],1]));
    return res.reshape(res.size); // flat, one row
};

const meanCoordMap  = function(all) {

    var result = nj.zeros(16, 'float32');
    all.forEach(function(x) {
        var p = nj.array(x, 'float32');
        result = result.add(x);
    });
    return result.divide(all.length).tolist();
};

const stDev = function(all) {
    return nj.array(all, 'float32')
        .transpose()
        .tolist()
        .map(x => nj.array(x, 'float32').std())
        .map(x => (x === 0 ? 0.00000001 : x));
};

const medianCoordMap = function(all) {
    var allArray =  nj.array(all, 'float32');
    return allArray
        .transpose()
        .tolist()
        .map(x => x.sort())
        .map(x => x[Math.floor(x.length/2)]);
};

const closestToMedian = function(all) {
    var median = medianCoordMap(all);
    var std = stDev(all);
    var allOne = nj.zeros(all.length, 'float32').add(1).reshape(all.length, 1);
    var medianRow = nj.array(median, 'float32').reshape(1, median.length);
    var stdRow = nj.array(std, 'float32').reshape(1, std.length);
    var allArray = nj.array(all, 'float32');
    allArray = allArray.subtract(allOne.dot(medianRow));
    allArray = allArray.divide(allOne.dot(stdRow)); //convert to z-score
    var normError = norm2(allArray);
    var minVal = nj.min(normError);
    var minIndex = normError.tolist().findIndex(x => (x === minVal));
    return all[minIndex];
};

/*
*  Input: scanning bottom to  top, using the skinny side.
*
* Returns scanned top to bottom, left-to right using the wide side.
*  and serialized as a C array (row-major)
*/
const shortToLongScan = function(corners, size2D) {
    var height =  size2D[0];
    var width =  size2D[1];
    var p = nj.array(corners, 'float32');
    p = p.reshape(width, height, 2);
    return new Float32Array(nj.flip(p, 1)
                            .transpose(1,0,2)
                            .reshape(size2D[0]*size2D[1]*2)
                            .tolist());
};

/*
 * corners is float32Array, e.g., [x0, y0, x1,y1,..]
 * size2D is [chessHeight, chessWidth]
 *
 * It returns a float32Array with the coordinates always in long scan order.
 *
*/
const orderCorners = function(corners, size2D) {
    var height =  size2D[0];
    var width =  size2D[1];
    var p = nj.array(corners, 'float32');
    p = p.reshape(p.size/2, 2);
    var distance = norm2(p.slice(1).subtract(p.slice([-1])));
    var shortScan = distance.slice(height-1).slice([null,null, height]).sum();
    shortScan = shortScan/(width-1);
    var longScan = distance.slice(width-1).slice([null,null, width]).sum();
    longScan = longScan/(height-1);
    if (shortScan > longScan) {
        console.log('Changing scan order');
        // need to change scan order
        return shortToLongScan(corners, size2D);
    } else {
        return corners;
    }

};

const extractCameraFrame = function(gl) {

    var result = {width: gl.drawingBufferWidth,
                  height: gl.drawingBufferHeight};
    var src = new cv.Mat(result.height, result.width, cv.CV_8UC4);
    gl.readPixels(0, 0, gl.drawingBufferWidth,
                  gl.drawingBufferHeight, gl.RGBA,
                  gl.UNSIGNED_BYTE, src.data);

    var dst = new cv.Mat(result.height, result.width, cv.CV_8UC1);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    src.delete();
    var flipDst = new cv.Mat(result.height, result.width, cv.CV_8UC1);
    cv.flip(dst, flipDst, 0);
    dst.delete();

    result.img = flipDst;

    console.log('dst: size ' + JSON.stringify(result));
    console.log(flipDst.matSize);
    var scaledHeight = Math.floor(result.height/SCALE_FACTOR);
    var scaledWidth = Math.floor(result.width/SCALE_FACTOR);
    if ((scaledHeight <  MINIMUM_GL_SIZE) || (scaledHeight < MINIMUM_GL_SIZE)) {
        scaledHeight = result.height;
        scaledWidth = result.width;
    }
    var scaledDst = new cv.Mat(scaledHeight, scaledWidth, cv.CV_8UC1);
    cv.resize(flipDst, scaledDst, {height: scaledHeight, width: scaledWidth});
    result.scaledImg = scaledDst;
    return result;
};


const sanityCheck = function(projectionMatrix, coordMapping, localState, p3D,
                           actualP2D, sizeChess, frame) {
    var arState = localState.ar;
    var coordMap = nj.array(coordMapping, 'float32').reshape(4, 4)
            .transpose();
    var view = nj.array(arState.viewMatrix, 'float32').reshape(4, 4)
            .transpose();
    console.log('view: ' + JSON.stringify(view.tolist()));

    var proj = nj.array(projectionMatrix, 'float32').reshape(4, 4).transpose();
    var all =  nj.dot(proj, nj.dot(view, coordMap));

    var transformOne = function(p) {
        var pH = nj.array(p.concat([1]), 'float32').reshape(4, 1);
        var newPH = nj.dot(all, pH);
        var persp = newPH.divide(newPH.get(0,2));
        var x = persp.get(0, 0);
        var y = persp.get(0, 1);
        x = x * frame.width/2 + frame.width/2;
        y = frame.height - (y * frame.height/2 + frame.height/2);
        return [x, y];
    };

    var newP3D = nj.array(p3D, 'float32');
    newP3D = newP3D.reshape(newP3D.size/3, 3);

    var backProj = newP3D.tolist().map(transformOne);
//    console.log(JSON.stringify(backProj));
    var orig = nj.array(actualP2D, 'float32');
    orig = orig.reshape(orig.size/2, 2);
    //    console.log(JSON.stringify(orig.tolist()));
    var errDistance = orig.subtract(nj.array(backProj, 'float32'));
    var avgError = nj.sum(norm2(errDistance).sqrt())/errDistance.shape[0];

    console.log('Average reprojection error in pixels: ' + avgError);
//    console.log(JSON.stringify(orig.subtract(nj.array(backProj, 'float32'))
//                               .tolist()));

    var points = cv.matFromArray(sizeChess.width*sizeChess.height, 1,
                                 cv.CV_32FC2,
                                 Array.prototype.concat.apply([], backProj));
    cv.drawChessboardCorners(frame.img, sizeChess, points, true);
    points.delete();

    return avgError;
};


const toggleVideo = exports.toggleVideo = function(isOn, id) {
    var canvas = document.getElementById('canvasOutput');
    var identifier = document.getElementById('identifier');
    var cameraFeed = document.getElementById('camerafeed');
    if (canvas) {
        canvas.style = (isOn ? 'display:none' : 'display:block;z-index:1;');
    }

    if (cameraFeed) {
        cameraFeed.style = (isOn ? 'display:block' : 'display:none');
    }

    if (isOn) {
        if (id) {
            identifier.innerHTML = id;
            identifier.style = 'display:block;z-index:1;';
        }
    } else {
        identifier.style = 'display:none';
    }
};

const distance = function(x0, y0, x1, y1) {
    var x = x0 - x1;
    var y = y0 - y1;
    return Math.sqrt(x*x + y*y);
};

const reverseXZ = function(p3D) {
    if ((p3D[3] -p3D[0]) < 0) {
        console.log('Reversing XZ');
        /*solvePNP needs a bit of help, better 180 rotate over Y axis, i.e.,
         X' = -X and Z' = -Z, and undo the rotation later */
        for (var i = 0; i< Math.floor(p3D.length/3); i++) {
            p3D[3*i] = -p3D[3*i];
            p3D[3*i+2] = -p3D[3*i+2];
        }
        return true;
    } else {
        return false;
    }

};

exports.init = async function(ctx, localState, data) {
    var cvState = {
        nSnapshots: 0,
        tempCoord: [],
        coordMapping: null
    };
    toggleVideo(true);
    await cvPromise;
    localState.cv = cvState;
    await arucoUtil.init(ctx, localState, data);
    console.log('cvUtil init done');
    return cvState;
};

exports.update = function(localState, gState) {
    return localState;
};

exports.process = function(localState, gState, gl) {

    var cvState = localState.cv;
    var arState = localState.ar;
    var counter = arState.counter;
    var coordMapping = cvState.coordMapping;

    cvState.nSnapshots = cvState.nSnapshots || 0;

    // Refresh browser to trigger calibration
    if ((counter % UPDATE_EVERY === 0) && (cvState.nSnapshots < MAX_SNAP) &&
        (coordMapping === null) && arState.hasPose &&
        gState.calibration && Array.isArray(gState.calibration.shape3D)) {
        var t1 = (new Date()).getTime();
        var fr = extractCameraFrame(gl);
        if (fr !== null) {
            var dst = fr.img;
            var scaledDst = fr.scaledImg;
            var width = fr.width;
            var height = fr.height;
            console.log('Height: ' + height + ' Width: ' + width);
            var size2D = gState.calibration.shape3D;

            var nPoints = size2D[1] * size2D[0];
            var points = new cv.Mat(nPoints, 1, cv.CV_32FC2);

            var sizeChess = {width: size2D[1], height: size2D[0]};

            var patternFound = cv.findChessboardCorners(scaledDst, sizeChess,
                                                        points);
            if (patternFound) {
                toggleVideo(false);
                for (let i = 0; i < points.data32F.length; i++) {
                    points.data32F[i] = SCALE_FACTOR * points.data32F[i];
                }
                cv.cornerSubPix(dst, points, {height: 11, width: 11},
                                {height: -1, width: -1}, {
                                    type: cv.TermCriteria_EPS +
                                        cv.TermCriteria_MAX_ITER,
                                    maxCount: 30,
                                    epsilon: 0.001
                                });
                //cv.drawChessboardCorners(dst, sizeChess, points, true);
                var projectionMatrix = gPixelGLProjMat(width, height);
                cvState.projectionMatrix = projectionMatrix;
                var cameraMatrix = gl2cvProjMat(projectionMatrix, width,
                                                height);

                var pointsArray = points.data32F;
                // Check scan direction
                pointsArray = orderCorners(pointsArray, size2D);
                var p2DMat = cv.matFromArray(nPoints, 1, cv.CV_32FC2,
                                             pointsArray);
                var p3D = Array.prototype.concat.apply([], gState.calibration
                                                       .points3D);
                var p3DOriginal = p3D.slice(0);
                var isReversedXZ  = reverseXZ(p3D);
                var p3DMat = cv.matFromArray(nPoints, 1, cv.CV_32FC3, p3D);

                // Find mapping
                var rVec = new cv.Mat(3, 1, cv.CV_64F);
                var tVec = new cv.Mat(3, 1, cv.CV_64F);
                var inliers = new cv.Mat(nPoints, 1, cv.CV_32S);
                var empty = cv.Mat.zeros(4, 1, cv.CV_64F);
                var found = cv.solvePnPRansac(p3DMat, p2DMat, cameraMatrix,
                                              empty, rVec, tVec, false, 200,
                                              2.0, 0.99, inliers,
                                              cv.SOLVEPNP_EPNP);
                console.log(found);
                //console.log(JSON.stringify(p3DMat.data32F));
                //console.log(JSON.stringify(p2DMat.data32F));
                console.log(JSON.stringify(cameraMatrix.data64F));
                console.log('isReversedXZ: ' + isReversedXZ);
                console.log('rotation: ' + JSON.stringify(rVec.data64F));
                console.log('translation: ' + JSON.stringify(tVec.data64F));
                console.log('inliers: ' + JSON.stringify(inliers.size()));

                var viewMatrix = openGLViewMat(rVec, tVec, isReversedXZ);
                console.log('viewMatrix: ' + JSON.stringify(viewMatrix));

                var newCoordMapping = computeCoordMap(arState.poseModelMatrix,
                                                       viewMatrix);
                console.log(newCoordMapping);

                var averageError = sanityCheck(projectionMatrix,
                                               newCoordMapping, localState,
                                               p3DOriginal,
                                               pointsArray, sizeChess, fr);
                var diag = distance(pointsArray[0], pointsArray[1],
                                    pointsArray[2*nPoints-2],
                                    pointsArray[2*nPoints-1]);
                var relError = 100.0*averageError/diag;
                console.log('Diag: ' + diag + ' relError: ' + relError);

                if (relError < THRESHOLD_ERROR) {
                    cvState.nSnapshots = cvState.nSnapshots + 1;
                    if (cvState.nSnapshots === 1) {
                        toggleVideo(false);
                    }
                    if (!cvState.id) {
                        cvState.id = arucoUtil.findId(cv, dst, pointsArray);
                    }
                    cvState.tempCoord.push(newCoordMapping);
                    if (cvState.nSnapshots === MAX_SNAP) {
                      //cvState.coordMapping = meanCoordMap(cvState.tempCoord);
                        cvState.coordMapping = closestToMedian(cvState
                                                               .tempCoord);
                        if (!cvState.id) {
                            console.log('ERROR:missing UID, please get closer');
                            // TODO: display error and quit
                        }
                        if (!gState.myUID && cvState.id) {
                            // assume first initialization
                            AppActions.setMyUID(localState.ctx, cvState.id);
                        }
                        toggleVideo(true, cvState.id);
                        console.log(JSON.stringify(cvState.tempCoord));
                        console.log(JSON.stringify(cvState.coordMapping));
                        if (gState.myUID && cvState.id &&
                            (gState.myUID !== cvState.id)) {
                            var invMat = gState.targets[cvState.id] &&
                                    gState.targets[cvState.id]
                                    .inverseTransformMat;
                            if (invMat) {
                                cvState.coordMapping =
                                    computeRemoteTarget(cvState.coordMapping,
                                                        invMat);
                            } else {
                                console.log('ERROR: missing transform for ' +
                                            'remote target, please calibrate');
                                // TODO: display error and quit
                            }
                        }
                    }
                } else {
                    console.log('Ignoring bad frame.');
                }

                p3DMat.delete();
                p2DMat.delete();
                rVec.delete();
                tVec.delete();
                inliers.delete();
                empty.delete();
                cameraMatrix.delete();
            } else {
                console.log('.');
            }

            cv.imshow('canvasOutput', dst); //delete
            dst.delete();
            scaledDst.delete();
            points.delete();
        }
        var t2 = (new Date()).getTime();
        console.log(t2-t1);
    }
};
