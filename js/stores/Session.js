let EventEmitter = require('events').EventEmitter;
let Dispatcher = require('../dispatcher/Dispatcher.js');
let Constants = require('../constants/Constants.js');
let assign = require('object-assign');

let ActionTypes = Constants.ActionTypes;

let CHANGE_EVENT = 'change';

let _sessionId = null;

let SessionStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getSessionId: function() {
        return _sessionId;
    }
});

SessionStore.dispatchToken = Dispatcher.register(function(action) {

    switch(action.type) {

        case ActionTypes.SESSION_LOADED:
            _sessionId = action.sessionId;
            SessionStore.emitChange();
            break;

        default:
            // do nothing
    }

});

module.exports = SessionStore;
