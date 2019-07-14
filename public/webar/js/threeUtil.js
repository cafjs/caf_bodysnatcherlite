"use strict";

var AppActions = require('./actions/AppActions');

var THREE = require('three');
if (global) {
    // 8th wall needs it...
    global.THREE = THREE;
}

// total diameter is 2*(TORUS_RADIOUS+TORUS_TUBE_DIAMETER)
const TORUS_RADIUS = 0.025; // in meters
const TORUS_TUBE_DIAMETER= 0.015;
const ABSOLUTE_PART = -1;
const MAX_CHANCES = 2;
const SPEED = 0.03;
const UPDATE_EVERY = 30;

const WP_GEOMETRY = new THREE.SphereGeometry( 0.005);
const WP_MATERIAL = new THREE.MeshBasicMaterial( {color: 0x00ffff} );

const DONUTS_GEOMETRY =  new THREE.TorusGeometry(TORUS_RADIUS,
                                                 TORUS_TUBE_DIAMETER, 16, 64);

exports.init = async function(ctx, localState, data) {

    //{scene, camera, renderer}
    var threeState = XR.Threejs.xrScene();

    var group = new THREE.Group();
    var groupWorldPoints = new THREE.Group();
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    group.add(light);
    var light2 = new THREE.AmbientLight(0xFFFFFF, 0.7);
    group.add(light2);
    group.visible = true;
    group.matrixAutoUpdate = false;
    threeState.group = group;
    threeState.groupWorldPoints = groupWorldPoints;

    localState.three = threeState;
    console.log('threeUtil init done');
    return threeState;
};


var syncDonuts = function(group, markers) {
    var newDonut = function(name, spinning, color, location) {
        var material = new THREE.MeshLambertMaterial({ color: color });
        var donut =  new THREE.Mesh(DONUTS_GEOMETRY, material);
        donut['__meta__'] = {name: name, spinning: spinning, color:color,
                             location: location, missing: 0};
        return donut;
    };

    var all = {};
    var toRemove = [];
    group.traverse(function (obj) {
        if ((obj instanceof THREE.Mesh) && obj.__meta__ ) {
            var name = obj.__meta__.name;
            var desired = markers[name];
            if (desired && (desired.color == obj.__meta__.color)) {
                all[name] = obj;
                obj.__meta__.spinning = desired.spinning;
                obj.__meta__.location = desired.location;
            } else {
                toRemove.push(obj);
            }
        }
    });

    toRemove.forEach(x => group.remove(x));

    Object.keys(markers).forEach(function(x) {
        if (!all[x]) {
            var desired = markers[x];
            group.add(newDonut(x, desired.spinning, desired.color,
                               desired.location));
        }
    });
};

var updatePosition = function(group, parts) {
    group.traverse(function (obj) {
        if ((obj instanceof THREE.Mesh) && obj.__meta__ ) {
            // location is {part: int, offset: [x:int, y: int, z: int]}
            var loc = obj.__meta__.location;
            if (parts[loc.part]) {
                obj.__meta__.missing = 0;
                var x = parts[loc.part][0] + loc.offset[0];
                var y = parts[loc.part][1] + loc.offset[1];
                var z = parts[loc.part][2] + loc.offset[2];
                obj.position.set(x, y, z);
                if (!obj.__meta__.spinning) {
                    obj.rotation.y = 0.0;
                }
                obj.visible = true;
            } else if (loc.part === ABSOLUTE_PART) {
                obj.__meta__.missing = 0;
                obj.position.set(loc.offset[0], loc.offset[1],
                                 loc.offset[2]);
                if (!obj.__meta__.spinning) {
                    obj.rotation.y = 0.0;
                }
                obj.visible = true;
            } else {
                if (obj.__meta__.missing >= MAX_CHANCES) {
                    obj.visible = false;
                } else {
                    obj.__meta__.missing = obj.__meta__.missing + 1;
                }
            }
        }
    });
};

var update = exports.update = function(localState, gState) {
    var threeState = localState.three;
    var group = threeState && threeState.group;
    try {
        gState.markers && group && syncDonuts(group, gState.markers);
        group && updatePosition(group, gState.parts || {});
    } catch(err) {
        console.log(err);
    }
    return localState;
};

var updateWorldPoints = function(groupWP, wp) {

    //cleanup from last frame
    var toRemove = [];
    groupWP.traverse((obj) => toRemove.push(obj));
    toRemove.forEach((obj) => groupWP.remove(obj));

    var validWP = wp.filter((p) => (p.confidence > 0.5));

    validWP.sort((a,b) => b.confidence -a.confidence);
    validWP = validWP.slice(0, 20); // Max #points


    validWP.forEach((gwp) => {
        var sphere = new THREE.Mesh(WP_GEOMETRY, WP_MATERIAL);
        sphere.position.set(gwp.position.x, gwp.position.y, gwp.position.z);
        groupWP.add(sphere);
    });
};


exports.process = async function(localState, gState) {
    var arState = localState.ar;
    var counter = arState.counter;

    var cvState = localState.cv;
    var coordMapping = cvState.coordMapping;
    var projectionMatrix = cvState.projectionMatrix;

    var threeState = localState.three;
    var scene = threeState.scene;
    var renderer = threeState.renderer;
    var camera = threeState.camera;
    var group = threeState.group;
    var groupWorldPoints = threeState.groupWorldPoints;

    var handleTouch = () => {
        var touch = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();

        if (localState.touch) {
            touch.x = localState.touch.x;
            touch.y = localState.touch.y;

            raycaster.setFromCamera(touch, camera);

            var all = group.children.filter(obj => (obj instanceof THREE.Mesh));
            var touched = raycaster.intersectObjects(all);
            if (touched.length > 0) {
                // Pick only the closest
                AppActions.arTouched(localState.ctx, touched[0].object);
            } else {
                // touch anywhere else to remove sensor info
                AppActions.clearTouched(localState.ctx);
            }
        }
    };


    // add  donuts to 'group' here
    if (group && group.visible) {
        group.traverse(function (obj) {
            if ((obj instanceof THREE.Mesh) && obj.__meta__  &&
                obj.__meta__.spinning) {
                obj.rotation.y -= SPEED;
            }
        });

        if (counter % UPDATE_EVERY === 0) {
            update(localState, gState);
        }
    }
    // end update donuts

    if (projectionMatrix) {
        for (let i = 0; i < 16; i++) {
            camera.projectionMatrix.elements[i] = projectionMatrix[i];
        }
    }

    renderer.clear();

    if (coordMapping) {
        /* Group maps from external global coordinates to current
         * global coords.*/
        group.matrix.fromArray(coordMapping);
        group.updateMatrixWorld(true);
        scene.add(group);

        handleTouch();
    }

    var worldPoints = arState.worldPoints || [];
    updateWorldPoints(groupWorldPoints, worldPoints);
    scene.add(groupWorldPoints);


    delete localState.touch; // only process once (or ignore...)
};
