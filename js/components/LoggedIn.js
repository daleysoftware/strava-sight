let React = require('react');

let Constants = require('../constants/Constants.js');
let SessionStore = require('../stores/Session.js');

let LoggedIn = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    componentDidMount: function() {
    },
    
    componentWillUnMount: function() {
    },

    _onChange: function() {
    },

    render() {
        return (
            <p>Logged in!</p>
        )
    }
});

module.exports = LoggedIn;