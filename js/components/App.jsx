let React = require('react');

let SessionStore = require('../stores/Session.js');

let LoggedIn = require('./LoggedIn.js');
let LoginForm = require('./LoginForm.js');

let App = React.createClass({
    getInitialState: function() {
        return {
            authenticated: null
        }
    },

    componentDidMount() {
        SessionStore.addChangeListener(this._onChange);
    },

    componentWillUnMount: function() {
        SessionStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            authenticated: SessionStore.getIsAuthenticated()
        });
    },

    render() {
        if (this.state.authenticated) {
            return (
                <LoggedIn />
            )
        } else {
            return (
                <LoginForm />
            )
        }
    }
});

module.exports = App;
