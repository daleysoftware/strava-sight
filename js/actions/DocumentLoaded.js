let _ = require('lodash');
let $ = require('jquery');

let SessionLoadedActionCreator = require('./SessionLoaded.js');

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
            console.log("Using old session ID " + sessionId);

            // Old session ID loaded. We are not sure if it is authenticated at this point.
            SessionLoadedActionCreator.oldSessionLoaded(sessionId);
        } else {
            $.ajax({
                type: 'GET',
                url: Constants.RestEndpoint + '/session',
                dataType: 'json',
                success: function (data) {
                    let sessionId = data['sessionId'];

                    document.cookie = 'sessionId=' + sessionId;
                    console.log("Obtained new session ID " + sessionId);

                    Dispatcher.dispatch({
                        type: ActionTypes.SESSION_NEW,
                        sessionId: sessionId
                    });
                }
             });
        }
    }
};
