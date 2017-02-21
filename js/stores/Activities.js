let EventEmitter = require('events').EventEmitter;
let Dispatcher = require('../dispatcher/Dispatcher.js');
let Constants = require('../constants/Constants.js');
let assign = require('object-assign');

let ActionTypes = Constants.ActionTypes;

let CHANGE_EVENT = 'change';

let _loading = true;
let _activities = null;

let ActivitiesStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getActivities: function() {
        return _activities;
    },

    getIsLoading: function() {
        return _loading;
    }
});

ActivitiesStore.dispatchToken = Dispatcher.register(function(action) {

    switch(action.type) {

        case ActionTypes.ACTIVITIES_LOADED:
            _activities = action.activities;
            _loading = false;
            ActivitiesStore.emitChange();
            break;

        case ActionTypes.ACTIVITIES_BEING_FETCHED:
            _activities = null;
            _loading = true;
            ActivitiesStore.emitChange();
            break;

        default:
            // do nothing
    }

});

module.exports = ActivitiesStore;
