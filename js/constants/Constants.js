var keyMirror = require('keymirror');

module.exports = {
    RestEndpoint: '/api/v1',

    ActionTypes: Object.freeze(keyMirror({
        // Sessions
        SESSION_NEW: null,
        SESSION_AUTHENTICATED: null,
        SESSION_DESTROYED: null,
        // Activities
        ACTIVITIES_LOADED: null,
        ACTIVITIES_BEING_FETCHED: null
    }))
};
