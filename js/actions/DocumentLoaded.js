let _ = require('lodash');
let $ = require('jquery');

let Dispatcher = require('../dispatcher/Dispatcher.js');
let Constants = require('../constants/Constants.js');

let ActionTypes = Constants.ActionTypes;

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

module.exports = {

    documentLoaded: function() {
        let sessionId = getCookie('sessionId');

        if (!_.isEmpty(sessionId)) {
            Dispatcher.dispatch({
                type: ActionTypes.SESSION_LOADED,
                sessionId: sessionId
            });
        } else {
            $.ajax({
                type: 'GET',
                url: Constants.Endpoint + '/session',
                dataType: 'json',
                success: function (data) {
                    let sessionId = data['sessionId'];
                    Dispatcher.dispatch({
                        type: ActionTypes.SESSION_LOADED,
                        sessionId: sessionId
                    });
                }
             });


        }
    }
};
