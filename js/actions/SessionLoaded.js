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

    sessionLoaded: function(sessionId) {
        $.ajax({
            type: 'GET',
            url: Constants.RestEndpoint + '/session/' + sessionId + "/verify",
            success: function (data) {
                Dispatcher.dispatch({
                    type: ActionTypes.SESSION_AUTHENTICATED,
                    sessionId: sessionId
                });
            }
        });
    }
};
