var keyMirror = require('keymirror');

module.exports = {
    
    Endpoint: 'http://localhost:4000/v1',

    ActionTypes: Object.freeze(keyMirror({
        SESSION_LOADED: null
    }))
};

