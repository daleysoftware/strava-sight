let React = require('react');

let LogoutActionCreator = require('../actions/Logout.js');


let LoggedIn = React.createClass({
    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
    },
    
    componentWillUnMount: function() {
    },

    _onChange: function() {
    },

    handleLogout: function(e) {
        e.preventDefault();
        LogoutActionCreator.logout();
    },

    render() {
        return (
            <div>
                <p>Logged in!</p>
                <p><a href="" onClick={this.handleLogout}>Log out</a></p>
            </div>
        )
    }
});

module.exports = LoggedIn;