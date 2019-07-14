"use strict";

var arUtil = require('./arUtil');
var cvUtil = require('./cvUtil');
var threeUtil = require('./threeUtil');
var assert = require('assert');

exports.init = async function(ctx, data) {
    var state =  data || {};
    var localState = {};
    var unsubscribe = null;

    var that = {
        mount: function() {
            if (!unsubscribe) {
                unsubscribe = ctx.store.subscribe(that.onChange);
                that.onChange();
            }
        },
        unmount: function() {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        },
        onChange: function() {
            if (unsubscribe) {
                state = ctx.store.getState();
                that.update();
            }
        },
        update: function() {
            arUtil.update(localState, state);
            cvUtil.update(localState, state);
            threeUtil.update(localState, state);
        }
    };

    that.mount();

    document.body.addEventListener('touchstart', function(ev) {
        if (ev.touches && ev.touches.length > 0) {
            var point = {
                x : 2*(ev.touches[0].clientX / window.innerWidth) -1,
                y: 1 - 2*(ev.touches[0].clientY / window.innerHeight)
            };
            localState.touch = point;
        }
    }, false);


    var update2D = function() {
        if (state.touched) {
            var msg = document.getElementById('message');
            msg.innerHTML = state.touched.__meta__.name;
            msg.style = 'display:block;z-index:25;color:' +
                state.touched.__meta__.color + ';';

        }

        if (state.sensorInfo && state.sensorInfo.msg) {
            var sensor = document.getElementById('sensor');
            sensor.innerHTML = state.sensorInfo.msg;
            sensor.style = 'display:block;z-index:25;border-width:5px;color:' +
                state.sensorInfo.color + ';';
        }

        if (!state.touched && !state.sensorInfo) {
            // cleanup
            sensor = document.getElementById('sensor');
            sensor.innerHTML = '';
            sensor.style = 'display:none';
            msg = document.getElementById('message');
            msg.innerHTML = '';
            msg.style = 'display:none';
        }

        var limTrack = document.getElementById('tracking');
        if (localState.ar && localState.ar.limitedTracking) {
            limTrack.innerHTML = 'LIMITED TRACKING';
            limTrack.style = 'display:block;z-index:25;';
        } else {
            limTrack.innerHTML = '';
            limTrack.style = 'display:none';
        }
    };

    var mainPipelineModule = function() {
        var gl = null;

        return {
            name: 'mainpipeline',
            onStart: async ({GLctx}) => {
                const {camera} = XR.Threejs.xrScene();
                gl = GLctx;
                camera.position.set(0, 1.5, 0); // Y greater than 0

                console.log('Camera position: ' +
                            JSON.stringify(camera.position));
                await arUtil.init(ctx, localState, data);
                await cvUtil.init(ctx, localState, data);
                await threeUtil.init(ctx, localState, data);


                // sync position and scene
                XR.XrController.updateCameraProjectionMatrix({
                    origin: camera.position,
                    facing: camera.quaternion
                });

            },

            onUpdate: ({processGpuResult, processCpuResult}) => {
                const {camera} = XR.Threejs.xrScene();
                console.log('Camera position: ' +
                            JSON.stringify(camera.position));

                // get 6DoF camera position/rotation
                arUtil.process(localState, state, processCpuResult.reality);

                // prepare to render 3D
                threeUtil.process(localState, state);

                update2D();
            },
            onRender: () => {
                // need to delay until GlTextureRenderer has rendered the frame
                // read & analyze input frame to find global coordinates
                cvUtil.process(localState, state, gl);
            }
        };
    };

    localState.ctx = ctx;

    var waitForClick = () => {
        return new Promise((resolve, reject) => {
            var btn = document.getElementById('enter-ar');
            var onEnterAR = async function() {
                console.log('clicked!');
                try {
                    await document.body.requestFullscreen({
                        navigationUI: 'hide'
                    });
                    btn.classList.remove('btn-enter');
                    btn.classList.add('btn-done');
                    console.log(JSON.stringify(XR.XrDevice.deviceEstimate()));
                    console.log("innerHeight:" + document.body.clientHeight +
                                "innerWidth:" + document.body.clientWidth);
                    XR.addCameraPipelineModules([
                        XR.GlTextureRenderer.pipelineModule(),
                        XR.Threejs.pipelineModule(),
                        XR.XrController.pipelineModule(),
                        XRExtras.FullWindowCanvas.pipelineModule(),
                        mainPipelineModule()
                    ]);

                    XR.XrController.configure({enableWorldPoints: true,
                                               enableLighting: false});

                    XR.run({canvas: document.getElementById('camerafeed')});

                    resolve({});
                } catch (err) {
                    reject(err);
                }
            };
            btn.addEventListener('click', onEnterAR, {once: true});
        });
    };

    await waitForClick();

    console.log('Starting pipeline');
    return that;
};
