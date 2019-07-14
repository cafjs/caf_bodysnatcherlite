"use strict";

exports.init = async function(ctx, localState, data) {
    var arState = {};
    arState.counter = 0;
    localState.ar = arState;
    return arState;
};

exports.update = function(localState, gState) {
    return localState;
};

exports.process = function(localState, gState, reality) {
    var arState = localState.ar;
    arState.counter = arState.counter + 1;
    arState.hasPose = reality && (reality.trackingStatus === 'NORMAL');
    if (arState.hasPose) {
        arState.intrinsics = reality.intrinsics;

        var q = reality.rotation;
        var p = reality.position;
        var quaternion = new THREE.Quaternion(q.x, q.y, q.z, q.w);
        var m = new THREE.Matrix4();
        m.makeRotationFromQuaternion(quaternion);
        m.setPosition(p);
        arState.poseModelMatrix = m.toArray();

        var mInv = new THREE.Matrix4();
        mInv.getInverse(m, true);
        arState.viewMatrix = mInv.toArray();
        arState.worldPoints = reality.worldPoints;
        arState.limitedTracking = !(reality.worldPoints &&
                                    (reality.worldPoints.length > 3));
//        console.log(JSON.stringify(arState.worldPoints));
    } else {
        // Skip frame
        console.log('.');
        arState.worldPoints = [];
        arState.limitedTracking = true;
        if (reality && (reality.trackingReason !== 'UNSPECIFIED')) {
            console.log(reality.trackingReason);
        }
    }
};
