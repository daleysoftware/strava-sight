let React = require('react');

let Constants = require('../constants/Constants.js');
let SessionStore = require('../stores/Session.js');

let SessionActionCreator = require('../actions/Session.js');

let LoginForm = React.createClass({
    getInitialState: function() {
        return {
            sessionId: null
        };
    },

    componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
        SessionActionCreator.loadSessionFromCookie();
    },

    componentWillUnMount: function() {
        SessionStore.removeChangeListener(this._onChange)
    },

    _onChange: function() {
        if (!this.isMounted()) {
            return;
        }

        this.setState({
            sessionId: SessionStore.getSessionId()
        });
    },

    render() {
        let authInitRoute = Constants.RestEndpoint + "/session/" + this.state.sessionId + "/auth/init";

        if (this.state.sessionId !== null) {
            return (
                <p><a href={authInitRoute}>Login with Strava</a></p>
            )
        } else {
            return (
                <p>Loading...</p>
            )
        }
    }
});

module.exports = LoginForm;