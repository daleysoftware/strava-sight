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
                <div className="vertical-center">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12">
                                <a className="text-center center-block" href={authInitRoute}>
                                    <img className="connect-logo" src="images/connect.png"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <p>Loading...</p>
            )
        }
    }
});

module.exports = LoginForm;