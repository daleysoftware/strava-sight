var keyMirror = require('keymirror');

module.exports = {
    
    RestEndpoint: 'http://localhost:4000/v1',
    WebsocketEndpoint: 'ws://localhost:5000',

    ActionTypes: Object.freeze(keyMirror({
        SESSION_LOADED: null,
        SESSION_AUTHENTICATED: null
    }))
};
