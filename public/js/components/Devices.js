var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');
var mapHuman = require('./mapHuman.js');

var VALID_COLORS = {
    'red': true,
    'yellow': true,
    'green': true,
    'blue': true,
    'white': true
};

var pickMenu =  function() {
    return Object.keys(mapHuman.partToId).map(function(x, i) {
        return cE(rB.MenuItem, {eventKey: mapHuman.partToId[x], key: 343*i +i},
                  x);
    });
};


class Devices extends React.Component {
    constructor(props) {
        super(props);
        this.handleName = this.handleName.bind(this);
        this.handlePart = this.handlePart.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.doAdd = this.doAdd.bind(this);
        this.doDelete = this.doDelete.bind(this);
        this.pickSelect = this.pickSelect.bind(this);
    }

    handleName(e) {
        var dev = Object.assign({}, this.props.localDevices, {
            name: e.target.value
        });
        AppActions.setLocalState(this.props.ctx, {localDevices: dev});
     }

    handlePart(e) {
        var dev = Object.assign({}, this.props.localDevices, {
            part: e.target.value
        });
        AppActions.setLocalState(this.props.ctx, {localDevices: dev});
    }

    handleColor(e) {
        var dev = Object.assign({}, this.props.localDevices, {
            color: e.target.value
        });
        AppActions.setLocalState(this.props.ctx, {localDevices: dev});
    }

    doAdd() {
        if (!VALID_COLORS[this.props.localDevices.color]) {
            var err = new Error('Invalid Color: pick one from ' +
                                JSON.stringify(Object.keys(VALID_COLORS)));
             AppActions.setError(this.props.ctx, err);
        } else if (typeof mapHuman.partToId[this.props.localDevices.part] !==
                   'number') {
            err = new Error('Invalid Part: pick one from ' +
                            JSON.stringify(Object.keys(mapHuman.partToId)));
            AppActions.setError(this.props.ctx, err);
        } else if (!this.props.localDevices.name) {
            err = new Error('Missing name');
            AppActions.setError(this.props.ctx, err);
        } else {
            AppActions.setMarker(this.props.ctx, this.props.localDevices.name,
                                 {part: mapHuman
                                  .partToId[this.props.localDevices.part],
                                  offset: [0,0,0]},
                                 this.props.localDevices.color, true);
        }
    }

    doDelete() {
        if (!this.props.localDevices.name) {
            var err = new Error('Missing name');
            AppActions.setError(this.props.ctx, err);
        } else {
            AppActions.deleteMarker(this.props.ctx,
                                    this.props.localDevices.name);
        }
    }

    pickSelect(eventKey) {
        var dev = Object.assign({}, this.props.localDevices, {
            part: mapHuman.idToPart[eventKey]
        });
        AppActions.setLocalState(this.props.ctx, {localDevices: dev});
    }

    render() {
        return cE(rB.Grid, {fluid: true},
                  cE(rB.Row, null,
                     cE(rB.Form, {inline: true},
                        cE(rB.FormGroup, {
                            controlId: 'nameDeviceId',
                            style: {'marginRight': 15}
                        },
                           cE(rB.ControlLabel, null, 'Name:'),
                           cE(rB.FormControl, {
                               type: 'text',
                               value: this.props.localDevices.name,
                               onChange: this.handleName
                           })
                          ),
                        cE(rB.FormGroup, {
                            controlId: 'partDeviceId',
                            style: {'marginRight': 15}
                        },
                           cE(rB.ControlLabel, null, 'Part:'),
                           cE(rB.InputGroup, null,
                              cE(rB.FormControl, {
                                  type: 'text',
                                  value: this.props.localDevices.part,
                                  onChange: this.handlePart
                              }),
                              cE(rB.InputGroup.Addon, {style: {padding: 0}},
                                 cE(rB.DropdownButton, {title: 'Pick',
                                                        id: 'dropdown-pick',
                                                        onSelect: this.pickSelect},
                                    pickMenu())
                                )
                             )
                          ),
                        cE(rB.FormGroup, {
                            controlId: 'colorDeviceId',
                            style: {'marginRight': 15}
                        },
                           cE(rB.ControlLabel, null, 'Color:'),
                           cE(rB.FormControl, {
                               type: 'text',
                               value: this.props.localDevices.color,
                               onChange: this.handleColor
                           })
                          )
                       )
                    ),
                  cE(rB.Row, null,
                     cE(rB.Col, {xs: 8, sm:4},
                        cE(rB.ButtonGroup, null,
                           cE(rB.Button, {
                               //className: 'lowerInRow',
                               bsStyle: 'primary',
                               onClick: this.doAdd
                           }, "Add"),
                           cE(rB.Button, {
                               //className: 'lowerInRow',
                               bsStyle: 'danger',
                               onClick: this.doDelete
                           }, "Delete")
                          )
                       )
                    )
                 );
    }
};

module.exports = Devices;
