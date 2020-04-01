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
var caf_iot = require('caf_iot');
var myUtils = caf_iot.caf_components.myUtils;
var json_rpc = caf_iot.caf_transport.json_rpc;
var iot_methods_ble = require('./iot_methods_ble');
var bleUtil = require('./iot_ble_util');
var util = require('util');
var setTimeoutPromise = util.promisify(setTimeout);

var startPartsStream = function(self, debug) {
    if (self.state.streamON && (self.state.streamID === null)) {
        var partsURL = self.$.props.baseURL + '/parts';
        var partsOptions = self.$.props.partsOptions;
        if (debug) {
            partsOptions = partsOptions || {};
            partsOptions['options'] = '{"display": true}';
        }
        self.state.streamID = self.$.http.startStream(partsURL, partsOptions,
                                                      '__iot_handleParts__');
        self.$.log && self.$.log.debug('Starting stream ' +
                                       self.state.streamID);
    }
};

var stopPartsStream = function(self) {
    if (self.state.streamID !== null) {
        self.$.log && self.$.log.debug('Stopping stream ' +
                                       self.state.streamID);
        self.$.http.stopStream(self.state.streamID);
        self.state.streamID = null;
    }
};


var methods = exports.methods = {
    async __iot_setup__() {
        this.scratch.devices = {};
        // {counter: number, isDelete: boolean}
        this.scratch.processing = {};
        this.state.streamID = null;
        this.state.lastParts = null;
        return [];
    },

    async __iot_loop__() {
        var now = (new Date()).getTime();
        this.$.log && this.$.log.debug(now + ' loop:' + this.state.index);
        this.$.log && this.$.log.debug('Time offset ' +
                                       (this.$.cloud.cli && this.$.cloud.cli
                                        .getEstimatedTimeOffset()));
        // Depth Info

        this.state.streamON = this.fromCloud.get('streamON');
        if (this.state.streamON) {
            var debugOption = this.fromCloud.get('debug');
            startPartsStream(this, debugOption);
        } else {
            stopPartsStream(this);
        }
        var parts = this.toCloud.get('parts');
        if (myUtils.deepEqual(parts, this.state.lastParts)) {
            this.toCloud.set('parts', {});
            this.state.lastParts = {};
        } else {
            this.state.lastParts = parts;
        }


        // BLE

        var deviceInfo = bleUtil.toDeviceInfo(this);
        var activeDeviceInfo = bleUtil.filterActive(deviceInfo);
        this.toCloud.set('deviceInfo', deviceInfo);
        /* type of markers is {name:{location:{}, color: string,
         *                           spinning: boolean}} */
        var markers = this.fromCloud.get('markers') || {};
        var diff = bleUtil.diffDevices(activeDeviceInfo, markers,
                                       this.scratch.processing,
                                       this.scratch.devices);
        bleUtil.decrementProcessing(this.scratch.processing);
        // Don't want to block main loop
        var p = bleUtil.evalDiffPromise(this, diff);
        p.then(() => {
            this.$.log && this.$.log.trace('evalDiffPromise OK');
        }).catch((err) => {
            this.$.log && this.$.log.debug('Error:evalDiffPromise' +
                                           myUtils.errToPrettyStr(err));
        });
        if ((Object.keys(markers).length > 0) ||
            (Object.keys(this.scratch.processing).length > 0))  {
            return this.findServices();
        } else {
            this.$.log && this.$.log.trace('Skipping findServices()');
            return [];
        }
    },

    async calibrate(nonce) {
        var calURL = this.$.props.baseURL + '/calibrate';
        var calOptions = this.$.props.calibrationOptions;
        stopPartsStream(this);
        await setTimeoutPromise(1000); // time to reset service after stop
        try {
            var value = await this.$.http.dirtyCallPromise(calURL, calOptions);
            value.nonce = nonce;
            this.$.log && this.$.log.debug(value);
            /*`value` type is {
             transformMat:Array<number>, i.e.,  external to our coordinates
             inverseTransformMat:Array<number>, i.e., reverse above
             uid:number, i.e., identifier
             shape3D: Array<number>  tuple with height, width #points
             points3D: Array<number> 3*height*width coordinates }
             */
            this.toCloud.set('calibration', value);
            startPartsStream(this);
            return [];
        } catch (err) {
            return [err];
        }
    },

    async snapshot() {
        var snapURL = this.$.props.baseURL + '/snapshot';
        var snapOptions = this.$.props.snapshotOptions;
        stopPartsStream(this);
        await setTimeoutPromise(1000); // time to reset service after stop
        try {
            var value = await this.$.http.dirtyCallPromise(snapURL,
                                                           snapOptions);
            // `value` type is {width: number, height:number, data: string }
            value.timestamp = (new Date()).getTime();
            this.toCloud.set('snapshot', value);
            startPartsStream(this);
            return [];
        } catch (err) {
            return [err];
        }
    },

    '__iot_handleParts__': function(parts, cb) {
        // Assumes cloudSync is enabled, and `toCloud` changes are propagated
        //  right away, and without blocking the main loop.

        parts = parts[0]; // no need 2-D projection
        // from assoc-list to map
        var dict = {};
        parts.forEach(function(x) {
            dict[x[0]] = x[1];
        });
        // `dict` type is Object(string, [x:number, y:number, z:number])
        this.toCloud.set('parts', dict);
        cb(null);
    }

};

myUtils.mixin(methods, iot_methods_ble.methods);
