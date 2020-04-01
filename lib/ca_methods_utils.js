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
var caf_comp = caf.caf_components;
var myUtils = caf_comp.myUtils;

var APP_SESSION = exports.APP_SESSION = 'default';
var VR_SESSION = exports.VR_SESSION = 'vr';
var AR_SESSION = exports.AR_SESSION = 'ar';
var IOT_SESSION = exports.IOT_SESSION = 'iot';

exports.notifyIoT = function(self) {
    var $$ = self.$.sharing.$;
    var notif = {fromCloud: $$.fromCloud.dump()};
    self.$.session.notify([notif], IOT_SESSION);
};

var notifyWebApp = exports.notifyWebApp = function(self) {
    var msg = {
        targets: myUtils.deepClone(self.state.targets),
        myUID: self.state.myUID,
        markers: self.state.markers,
        lastCalibration: self.state.lastCalibration,
        calibration: self.state.calibration,
        calibrating: self.state.calibrating,
        streamON: self.state.streamON,
        parts: self.state.parts,
        deviceInfo: self.state.deviceInfo
    };
    self.$.session.notify([msg], APP_SESSION);
    self.$.session.notify([msg], VR_SESSION);
    self.$.session.notify([msg], AR_SESSION);
};


exports.stopSpinning = function(self, deviceInfo) {
    var changed = false;
    Object.keys(deviceInfo).forEach(function(x) {
        var value = deviceInfo[x];
        if (value.advertisement && value.advertisement.serviceData &&
            (value.advertisement.serviceData.length > 0) &&
            self.state.markers[x] && self.state.markers[x].spinning) {
            self.state.markers[x].spinning = false;
            changed = true;
        }
    });

    return changed;
};
