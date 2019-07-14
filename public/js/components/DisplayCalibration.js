var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');

var formatPoints = function(p3D, header) {
    var triplets = [];
    for (let i=0; i<p3D.length/3; i++) {
        triplets.push([p3D[3*i].toFixed(5), p3D[3*i+1].toFixed(5),
                       p3D[3*i+2].toFixed(5)]);
    }
    return cE('ul', {style:{listStyleType:'none'}},
              [cE('li', {key: 33121*7233}, header)]
              .concat(triplets.map((x, key) => {
                  return cE('li', {key: key*7233}, JSON.stringify(x));
              })));
};

class DisplayCalibration extends React.Component {

    constructor(props) {
        super(props);
        this.doDismiss = this.doDismiss.bind(this);
    }

    doDismiss(ev) {
        AppActions.setLocalState(this.props.ctx, {showCalibration: false});
    }

    render() {
        return cE(rB.Modal,{show: (this.props.showCalibration ? true : false),
                            onHide: this.doDismiss,
                            animation: false},
                  cE(rB.Modal.Header, {
                      className : "bg-warning text-warning",
                      closeButton: true},
                     cE(rB.Modal.Title, null, "Calibration")
                    ),
                  cE(rB.ModalBody, null,
                     cE('p', null, this.props.calibration &&
                        this.props.calibration.nInliers &&
                        '#Inliers: ' + this.props.calibration.nInliers
                       ),
                     cE('p', null, this.props.calibration &&
                        this.props.calibration.uid &&
                        'Target UID: ' + this.props.calibration.uid
                       ),
                     cE('p', null, this.props.calibration &&
                        this.props.calibration.shape3D &&
                        'Shape3D [height, width]:' +
                        JSON.stringify(this.props.calibration.shape3D)
                       ),
                     this.props.calibration &&
                     this.props.calibration.points3D &&
                     formatPoints(this.props.calibration.points3D,
                                  'Points3D [x, y, z]:'),
                     cE('p', null, this.props.calibration &&
                        this.props.calibration.viewMat &&
                        'ViewMat: (column order) ' +
                        JSON.stringify(this.props.calibration.viewMat
                                       .map(x => x.toFixed(5)))
                       ),
                     cE('p', null, this.props.calibration &&
                        this.props.calibration.projMat &&
                        'ProjMat: ' +
                        JSON.stringify(this.props.calibration.projMat)
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismiss}, "Continue")
                    )
                 );
    }
};

module.exports = DisplayCalibration;
