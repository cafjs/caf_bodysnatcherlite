var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');
var urlParser = require('url');

class Manage extends React.Component {

     constructor(props) {
         super(props);
         this.handleStream = this.handleStream.bind(this);
         this.handleDebug = this.handleDebug.bind(this);
         this.doCalibrate = this.doCalibrate.bind(this);
         this.doSnapshot = this.doSnapshot.bind(this);
         this.doShowCalibration = this.doShowCalibration.bind(this);
         this.doResetCalibration = this.doResetCalibration.bind(this);
         this.doVR = this.doVR.bind(this);
         this.doAR = this.doAR.bind(this);
     }

    handleStream(e) {
        var streamON = e.target.checked;
        AppActions.activatePartsStream(this.props.ctx, streamON);
    }

    handleDebug(e) {
        var debug = e.target.checked;
        AppActions.setDebug(this.props.ctx, debug);
    }

    doCalibrate() {
        AppActions.calibrate(this.props.ctx);
    }

    doSnapshot() {
        AppActions.snapshot(this.props.ctx);
        AppActions.setLocalState(this.props.ctx, {showSnapshot: true});
    }

    doShowCalibration() {
        AppActions.setLocalState(this.props.ctx, {showCalibration: true});
    }

    doResetCalibration() {
         AppActions.resetCalibration(this.props.ctx);
    }

    doVR() {
        if (window && window.location && window.location.href) {
            var myURL = urlParser.parse(window.location.href);
            myURL.pathname = '/vr/index.html';
            myURL.hash = myURL.hash.replace('session=default', 'session=vr');
            delete myURL.search; // delete cacheKey
            window.open(urlParser.format(myURL), '_blank');
        }
    }

     doAR() {
        if (window && window.location && window.location.href) {
            var myURL = urlParser.parse(window.location.href);
            myURL.pathname = '/webar/index.html';
            myURL.hash = myURL.hash.replace('session=default', 'session=ar');
            delete myURL.search; // delete cacheKey
            window.open(urlParser.format(myURL), '_blank');
        }
     }

    render() {
        return  cE(rB.Grid, {fluid: true},
                   cE(rB.Row, null,
                      cE(rB.Col, {sm:2, xs:4},
                         cE(rB.Checkbox, {
                             //inline: true,
                             //title: 'Streaming',
                             checked: this.props.streamON,
                             onChange: this.handleStream
                         }, 'Streaming')
                        ),
                      cE(rB.Col, {sm:2, xs:4},
                         cE(rB.Checkbox, {
                             checked: this.props.debug,
                             onChange: this.handleDebug
                         }, 'Debug')
                        ),
                      cE(rB.Col, {sm:8, xs:12},
                         cE(rB.ButtonToolbar, {bsClass:'btn-toolbar'},
                            cE(rB.ButtonGroup, {/*className: 'lowerInRow'*/},
                               cE(rB.Button, {
                                   bsStyle: 'primary',
                                   onClick: this.doSnapshot
                               }, "Snapshot")
                              ),
                            cE(rB.ButtonGroup, null,
                               cE(rB.Button, {
                                   bsStyle: (this.props.calibrating ? 'danger' :
                                             'info'),
                                   onClick: this.doCalibrate
                               }, "Calibrate"),
                               cE(rB.Button, {
                                   bsStyle: (this.props.calibrating ? 'danger' :
                                             'primary'),
                                   onClick: this.doShowCalibration
                               }, "Show"),
                               cE(rB.Button, {
                                   bsStyle: 'danger' ,
                                   onClick: this.doResetCalibration
                               }, "Reset")
                              ),
                            cE(rB.ButtonGroup, null,
                               cE(rB.Button, {
                                   bsStyle: 'info',
                                   onClick: this.doVR
                               }, "VR"),
                               cE(rB.Button, {
                                   bsStyle: 'primary',
                                   onClick: this.doAR
                               }, "AR")
                              )
                           )
                        )
                     )
                  );
    }
};

module.exports = Manage;
