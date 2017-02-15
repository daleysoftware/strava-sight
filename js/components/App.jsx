let React = require('react');

let SessionStore = require('../stores/Session.js');

let LoggedIn = require('./LoggedIn.js');
let LoginForm = require('./LoginForm.js');

//let Socket = require('../socket.js');

let App = React.createClass({
    getInitialState: function() {
        return {
            authenticated: null
        }
    },

    componentDidMount() {
        //let ws = new WebSocket('ws://localhost:4000');
        //let socket = this.socket = new Socket(ws);
        //socket.on('message add', this.onMessageAdd.bind(this));

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

    /*onMessageAdd(message){
        let {messages} = this.state;
        messages.push(message);
        this.setState({messages});
    }*/

    render() {
        if (this.state.authenticated) {
            return (
                <div className="app">
                    <LoggedIn />
                </div>
            )
        } else {
            return (
                <div className='app'>
                    <LoginForm />
                </div>
            )
        }
    }
});

module.exports = App;
