let React = require('react');

let DocumentLoadedActionCreator = require('../actions/DocumentLoaded.js');

let LoginForm = require('./LoginForm.js');

//let Socket = require('../socket.js');

let App = React.createClass({
    componentDidMount() {
        //let ws = new WebSocket('ws://localhost:4000');
        //let socket = this.socket = new Socket(ws);
        //socket.on('message add', this.onMessageAdd.bind(this));

        DocumentLoadedActionCreator.documentLoaded();
    },

    /*onMessageAdd(message){
        let {messages} = this.state;
        messages.push(message);
        this.setState({messages});
    }*/

    render() {
        return (
            <div className='app'>
                <LoginForm />
            </div>
        )
    }
});

module.exports = App;
