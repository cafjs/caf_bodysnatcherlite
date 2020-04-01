// Modifications copyright 2020 Caf.js Labs and contributors
/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';
var caf = require('caf_core');
var json_rpc = caf.caf_transport.json_rpc;
var caf_comp = caf.caf_components;
var myUtils = caf_comp.myUtils;
var appUtils = require('./ca_methods_utils');
var app = require('../public/js/app.js');

var STALE_COUNTER = 10;

// opencv coordinates, scan by row (left-right) then column (top-bottom)
const DEFAULT_CALIB_3D = [
    [ 0.1855,  0.082 ,  0   ],
    [ 0.133 ,  0.082 ,  0   ],
    [ 0.0805,  0.082 ,  0   ],
    [ 0.028 ,  0.082 ,  0   ],
    [-0.0245,  0.082 ,  0   ],
    [-0.077 ,  0.082 ,  0   ],
    [-0.1295,  0.082 ,  0   ],
    [ 0.1855,  0.1345,  0   ],
    [ 0.133 ,  0.1345,  0   ],
    [ 0.0805,  0.1345,  0   ],
    [ 0.028 ,  0.1345,  0   ],
    [-0.0245,  0.1345,  0   ],
    [-0.077 ,  0.1345,  0   ],
    [-0.1295,  0.1345,  0   ],
    [ 0.1855,  0.187 ,  0   ],
    [ 0.133 ,  0.187 ,  0   ],
    [ 0.0805,  0.187 ,  0   ],
    [ 0.028 ,  0.187 ,  0   ],
    [-0.0245,  0.187 ,  0   ],
    [-0.077 ,  0.187 ,  0   ],
    [-0.1295,  0.187 ,  0   ],
    [ 0.1855,  0.2395,  0   ],
    [ 0.133 ,  0.2395,  0   ],
    [ 0.0805,  0.2395,  0   ],
    [ 0.028 ,  0.2395,  0   ],
    [-0.0245,  0.2395,  0   ],
    [-0.077 ,  0.2395,  0   ],
    [-0.1295,  0.2395,  0   ]
];

const DEFAULT_CALIB_DIM = [4, 7]; // 4 rows, 7 columns

const DEFAULT_CALIB = {
    shape3D: DEFAULT_CALIB_DIM,
    points3D: Array.prototype.concat.apply([], DEFAULT_CALIB_3D) // flatten
};

exports.methods = {

    // Called by the framework

    async __ca_init__() {
        this.state.myUID = null;
        this.state.targets = {};
        this.state.markers = {};
        this.state.parts = {};
        this.state.calibration = DEFAULT_CALIB;
        this.state.lastCalibration = DEFAULT_CALIB;

        this.scratch.snapshot = null; //too big for checkpoint or getState()
        this.state.calibrating = false;
        this.state.counter = 0;
        this.state.partsCounter = 0;
        this.state.debug = false;

        this.state.iotMethodsMeta = this.$.iot.iotMethodsMeta();
        this.$.session.limitQueue(1, appUtils.APP_SESSION); // last notification
        this.$.session.limitQueue(1, appUtils.IOT_SESSION); // ditto
        this.$.session.limitQueue(1, appUtils.VR_SESSION); // ditto
        this.$.session.limitQueue(1, appUtils.AR_SESSION); // ditto
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.trace__iot_sync__ = 'traceSync';
        this.state.trace__iot_resume__ = 'traceResume';

        return [];
    },

    async __ca_resume__(cp) {
        // need to recreate, in case the IoT  device implementation changed.
        this.state.iotMethodsMeta = this.$.iot.iotMethodsMeta();
        return [];
    },

    async __ca_pulse__() {
        this.$.log && this.$.log.debug('calling PULSE!!!');
        this.state.counter = this.state.counter + 1;
        if (this.state.counter - this.state.partsCounter > STALE_COUNTER) {
            this.state.parts = {};
            appUtils.notifyWebApp(this);
        }

        this.$.react.render(app.main, [this.state]);

        return [];
    },

    // Called by the web app

    async hello(key, tokenStr) {
        tokenStr && this.$.iot.registerToken(tokenStr);
        key && this.$.react.setCacheKey(key);
        return this.getState();
    },

    async setMyUID(uid) {
        if (uid === null) {
            this.state.myUID = null; // reset
        } else if (!this.state.myUID) {
            this.state.myUID = uid; // first time initialization
        } else {
            this.$.log && this.$.log.trace('Ignoring setMyUID');
        }
        return this.getState();
    },

    // location is {part: int, offset: [x:int, y: int, z: int]}
    async setMarker(name, location, color, spinning) {
        var $$ = this.$.sharing.$;
        this.state.markers[name] = {
            location: location, color: color, spinning: spinning
        };
        $$.fromCloud.set('markers', myUtils.deepClone(this.state.markers));
        appUtils.notifyWebApp(this);
        appUtils.notifyIoT(this);
        return this.getState();
    },

    async deleteMarker(name) {
        var $$ = this.$.sharing.$;
        delete this.state.markers[name];
        $$.fromCloud.set('markers', myUtils.deepClone(this.state.markers));
        appUtils.notifyWebApp(this);
        appUtils.notifyIoT(this);
        return this.getState();
    },

    async resetCalibration() {
        this.state.nonce = null;
        this.state.lastCalibration = DEFAULT_CALIB;
        this.state.calibrating = false;
        this.state.targets = {};
        return this.getState();
    },

    async calibrate() {
        this.state.nonce = myUtils.uniqueId();
        var bundle = this.$.iot.newBundle(this.$.props.margin);
        bundle.calibrate(0, [this.state.nonce]);
        this.$.iot.sendBundle(bundle);
        this.state.calibrating = true;
        appUtils.notifyIoT(this); // `notify` improves bundle responsiveness
        appUtils.notifyWebApp(this);
        return this.getState();
    },

    async snapshot() {
        var bundle = this.$.iot.newBundle(this.$.props.margin);
        bundle.snapshot(0, []);
        this.$.iot.sendBundle(bundle);
        appUtils.notifyIoT(this); // `notify` improves bundle responsiveness.
        appUtils.notifyWebApp(this);
        return this.getState();
    },

    async activatePartsStream(isON) {
        this.state.streamON = isON;
        var $$ = this.$.sharing.$;
        $$.fromCloud.set('streamON', isON);
        $$.fromCloud.set('debug', !!this.state.debug);
        appUtils.notifyIoT(this);
        return this.getState();
    },

    async setDebug(debug) {
        this.state.debug = debug;
        return this.getState();
    },

    async getSnapshot() {
        this.$.react.coin();
        return [null, {snapshot: this.scratch.snapshot}];
    },

    async sayHi(deviceName) {
        var bundle = this.$.iot.newBundle(this.$.props.margin);
        bundle.sayHi(0, [deviceName]);
        this.$.iot.sendBundle(bundle, this.$.iot.NOW);
        appUtils.notifyIoT(this);
        return this.getState();
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    },

    // Called by the IoT device

    async traceSync() {
        var $$ = this.$.sharing.$;
        var now = (new Date()).getTime();
        this.$.log.trace(this.state.fullName + ':Syncing!!:' + now);

        var parts = $$.toCloud.get('parts');
        if (parts && !myUtils.deepEqual(parts, this.state.parts)) {
            this.state.parts = myUtils.deepClone(parts);
            this.state.partsCounter = this.state.counter;
        }

        var newCal = $$.toCloud.get('calibration');
        if (newCal && !myUtils.deepEqual(newCal, this.state.lastCalibration)) {
            if (this.state.nonce === newCal.nonce) {
                newCal = myUtils.deepClone(newCal);
                this.state.lastCalibration = newCal;
                this.state.targets[newCal.uid] = {
                    transformMat: newCal.transformMat,
                    inverseTransformMat: newCal.inverseTransformMat
                };
                this.state.calibrating = false;
            } else {
                this.$.log && this.$.log.debug('Ignoring old calibration');
            }
        }

        var newSnap = $$.toCloud.get('snapshot');
        if (newSnap &&
            (newSnap.timestamp !== (this.scratch.snapshot &&
                                    this.scratch.snapshot.timestamp))) {
            this.scratch.snapshot = myUtils.deepClone(newSnap);
        }

        var deviceInfo = $$.toCloud.get('deviceInfo');
        if (deviceInfo &&
            !myUtils.deepEqual(deviceInfo, this.state.deviceInfo)) {
            this.state.deviceInfo = myUtils.deepClone(deviceInfo);
            appUtils.stopSpinning(this, deviceInfo);
        }

        appUtils.notifyWebApp(this);

        return [];
    },

    async traceResume() {
        var now = (new Date()).getTime();
        this.$.log.trace(this.state.fullName + ':Resuming!!:' + now);
        return [];
    }
};


caf.init(module);
