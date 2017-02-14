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

    oldSessionLoaded: function(sessionId) {
        $.ajax({
            type: 'GET',
            url: Constants.RestEndpoint + '/session/' + sessionId + "/auth/verify",
            success: function() {
                // The old session ID is authenticated.
                Dispatcher.dispatch({
                    type: ActionTypes.SESSION_AUTHENTICATED,
                    sessionId: sessionId
                });

            },
            error: function() {
                // The old session ID is not authenticated.
                Dispatcher.dispatch({
                    type: ActionTypes.SESSION_NEW,
                    sessionId: sessionId
                });
            }
        });
    }
};
