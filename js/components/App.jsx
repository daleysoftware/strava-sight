let React = require('react');

let Socket = require('../socket.js');

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount(){
        let ws = new WebSocket('ws://localhost:4000');
        let socket = this.socket = new Socket(ws);
        //socket.on('message add', this.onMessageAdd.bind(this));
    }

    /*onMessageAdd(message){
        let {messages} = this.state;
        messages.push(message);
        this.setState({messages});
    }*/

    render(){
        return (
            <div className='app'>
                <p><a href="http://localhost:4000/v1/auth/init">Login with Strava</a></p>
            </div>
        )
    }
}

module.exports = App;
