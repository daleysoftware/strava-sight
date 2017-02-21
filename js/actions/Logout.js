let _ = require('lodash');
let $ = require('jquery');

let Dispatcher = require('../dispatcher/Dispatcher.js');
let Constants = require('../constants/Constants.js');


let SessionStore = require('../stores/Session.js');

let ActionTypes = Constants.ActionTypes;

module.exports = {

    logout: function() {
        let sessionId = SessionStore.getSessionId();

        $.ajax({
            type: 'DELETE',
            url: Constants.RestEndpoint + '/session/' + sessionId,
            success: function () {
                document.cookie = 'sessionId=';

                Dispatcher.dispatch({
                    type: ActionTypes.SESSION_DESTROYED,
                    sessionId: sessionId
                });
            }
        });
    }
};
