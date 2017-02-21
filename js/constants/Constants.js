var keyMirror = require('keymirror');

module.exports = {
    // TODO make these env variables.
    // Dev
    RestEndpoint: 'http://localhost:4000/api/v1',
    // Prod
    //RestEndpoint: 'https://stravasight.com/api/v1',

    ActionTypes: Object.freeze(keyMirror({
        SESSION_NEW: null,
        SESSION_AUTHENTICATED: null,
        SESSION_DESTROYED: null
    }))
};
