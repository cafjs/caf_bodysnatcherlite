var AppConstants = require('../constants/AppConstants');

var AppReducer = function(state, action) {
    if (typeof state === 'undefined') {
        return  {markers: {}, parts: {}, calibration: null, streamON: false,
                 calibrating: false, showCalibration: false, debug: false,
                 isClosed: false, deviceSelected: null, overlayTarget: null,
                 showSnapshot: false, snapshot: null, localDevices: {
                     name:'', part: '', color: ''
                 }};
    } else {
        switch(action.type) {
        case AppConstants.APP_UPDATE:
        case AppConstants.APP_NOTIFICATION:
            return Object.assign({}, state, action.state);
        case AppConstants.APP_ERROR:
            return Object.assign({}, state, {error: action.error});
        case AppConstants.WS_STATUS:
            return Object.assign({}, state, {isClosed: action.isClosed});
        default:
            return state;
        }
    };
};

module.exports = AppReducer;
