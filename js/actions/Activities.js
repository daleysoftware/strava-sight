let _ = require('lodash');
let $ = require('jquery');

let Dispatcher = require('../dispatcher/Dispatcher.js');
let Constants = require('../constants/Constants.js');

let SessionStore = require('../stores/Session.js');

let ActionTypes = Constants.ActionTypes;

module.exports = {

    tryLoadActivities: function() {
        $.ajax({
            type: 'GET',
            url: Constants.RestEndpoint + '/activities',
            dataType: 'json',
            headers: {
                "Authorization": SessionStore.getSessionId()
            },
            success: function (data, textStatus, xhr) {
                if (xhr.status == 200) {
                    Dispatcher.dispatch({
                        type: ActionTypes.ACTIVITIES_LOADED,
                        activities: JSON.parse(data)
                    });
                } else if (xhr.status == 202) {
                     Dispatcher.dispatch({
                        type: ActionTypes.ACTIVITIES_BEING_FETCHED,
                    });
                }
            }
        });
    }
};
