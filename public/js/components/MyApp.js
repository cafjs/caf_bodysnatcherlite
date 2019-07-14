"use strict";

var React = require('react');
var rB = require('react-bootstrap');
var AppStatus = require('./AppStatus');
var DisplayError = require('./DisplayError');
var Devices = require('./Devices');
var Manage = require('./Manage');
var Parts = require('./Parts');
var DisplayCalibration = require('./DisplayCalibration');
var DisplaySnapshot = require('./DisplaySnapshot');
var DisplayDevices = require('./DisplayDevices');

var cE = React.createElement;

class  MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(DisplayCalibration, {
                      ctx: this.props.ctx,
                      calibration: this.state.lastCalibration,
                      showCalibration: this.state.showCalibration
                  }),
                  cE(DisplaySnapshot, {
                      ctx: this.props.ctx,
                      snapshot: this.state.snapshot,
                      showSnapshot: this.state.showSnapshot
                  }),
                  cE(rB.Panel, null,
                     cE(rB.Panel.Heading, null,
                        cE(rB.Panel.Title, null,
                           cE(rB.Grid, {fluid: true},
                              cE(rB.Row, null,
                                 cE(rB.Col, {sm:1, xs:1},
                                    cE(AppStatus, {
                                        isClosed: this.state.isClosed
                                    })
                                   ),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:10,
                                     className: 'text-right'
                                 }, "Body Snatcher Admin"),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:11,
                                     className: 'text-right'
                                 }, this.state.fullName)
                                )
                             )
                          )
                       ),
                     cE(rB.Panel.Body, null,
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, "Manage UID: " +
                                 this.state.myUID)
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Manage, {
                                  ctx: this.props.ctx,
                                  calibrating: this.state.calibrating,
                                  streamON: this.state.streamON,
                                  debug: this.state.debug
                              }))),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, "Add Device")
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Devices, {
                                  ctx: this.props.ctx,
                                  devices: this.state.markers,
                                  localDevices: this.state.localDevices
                              }))),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, "Parts")
                             ),
                           cE(rB.Panel.Body, null,
                              cE(rB.Grid, {fluid: true},
                                 cE(rB.Row, null,
                                    cE(rB.Col,{sm:6, xs:6},
                                       cE(DisplayDevices, {
                                           ctx: this.props.ctx,
                                           devices: this.state.markers,
                                           deviceInfo: this.state.deviceInfo,
                                           deviceSelected:
                                           this.state.deviceSelected,
                                           overlayTarget:
                                           this.state.overlayTarget
                                       })),
                                    cE(rB.Col,{sm:6, xs:6},
                                       cE(Parts, {
                                           ctx: this.props.ctx,
                                           parts: this.state.parts
                                       }))
                                   )
                                )
                             )
                          )
                       )
                    )
                 );
    }
};

module.exports = MyApp;
