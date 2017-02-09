let React = require('react');

let SessionStore = require('../stores/Session.js');

let LoginForm = React.createClass({
    getInitialState: function() {
        return {
            sessionId: null
        };
    },

    componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
    },
    
    componentWillUnMount: function() {
        SessionStore.removeChangeListener(this._onChange)
    },

    _onChange: function() {
        this.setState({
            sessionId: SessionStore.getSessionId()
        });
    },

    render() {
        let route = "http://localhost:4000/v1/auth/init?sessionId=" + this.state.sessionId;

        if (this.state.sessionId !== null) {
            return (
                <p><a href={route}>Login with Strava</a></p>
            )
        } else {
            return (
                <p>Loading...</p>
            )
        }
    }
});

module.exports = LoginForm;