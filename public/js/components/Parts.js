"use strict";

var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;

var Human = require('./Human.js');
var mapHuman = require('./mapHuman.js');

class Parts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var parts = this.props.parts || {};
        var partIds = Object.keys(parts);
        var allProps = {};
        partIds.forEach(function(x) {
            if (mapHuman.idToPart[x]) {
                allProps[mapHuman.idToPart[x] + 'Visible'] =
                    {visibility: 'visible'};
            }
        });
        return cE(Human, allProps);
    }
};

module.exports = Parts;
