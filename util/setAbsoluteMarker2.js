#!/usr/bin/env node

var caf_core = require('caf_core');
var caf_comp = caf_core.caf_components;
var async = caf_comp.async;
var myUtils = caf_comp.myUtils;
var caf_cli = caf_core.caf_cli;
var srpClient = require('caf_srp').client;
var parseArgs = require('minimist');
var argv = parseArgs(process.argv.slice(2), {
    number: ['x', 'y', 'z']
});

var ABSOLUTE_PART = -1;

//var SUFFIX='192.168.1.15.xip.io:8080';
var SUFFIX=(argv.suffix ? argv.suffix : 'vcap.me:8080');

console.log(process.argv[2]);

var isAdmin = (process.argv[2] == 'true');

var spec = {
    log: function(x) { console.error(x);},
    securityClient: srpClient,
    accountsURL: 'http://root-accounts.' + SUFFIX,
    password: argv.password || 'pleasechange',
    from: argv.from || 'foo-newdevice1',
    ca: argv.from || 'foo-newdevice1',
//        durationInSec: 1000000,
    appLocalName: 'bodysnatcherlite',
    disableBackchannel: true,
    appPublisher: 'root',
    unrestrictedToken: false
};

var URL = 'http://root-bodysnatcherlite.' + SUFFIX;

var s = new caf_cli.Session(URL, null, spec);

var x = (argv.x && parseFloat(argv.x)) || 0.0;
var y = (argv.y && parseFloat(argv.y)) || 0.0;
var z = (argv.z && parseFloat(argv.z)) || 0.0;
console.log('x:' + x + ' y:' + y + ' z:' + z);

s.onopen = function() {
    s.setMarker(argv.name || 'device1',
                {part: ABSOLUTE_PART, offset: [x, y, z]},
                argv.color || 'red',
                (argv.spinning && Boolean(argv.spinning)) || false,
                function(err, state) {
                    if (err) {
                        console.log(myUtils.errToPrettyStr(err));
                    } else {
                        console.log(state);
                    }
                    s.close();
                });
};

s.onclose = function(err) {
    if (err) {
        console.log(myUtils.errToPrettyStr(err));
        process.exit(1);
    }
    console.log('Done OK');
};
