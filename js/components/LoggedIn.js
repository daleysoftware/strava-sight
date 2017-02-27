let React = require('react');
let $ = require('jquery');

let ActivitiesStore = require('../stores/Activities.js');
let ActivitiesActionCreator = require('../actions/Activities.js');

let LogoutActionCreator = require('../actions/Logout.js');

let ActivityChart = require('./ActivityChart.js');
let Loading = require('./Loading.js');

let LoggedIn = React.createClass({

    getStateFromStore: function() {
        return {
            activities: ActivitiesStore.getActivities(),
            loading: ActivitiesStore.getIsLoading()
        };
    },

    getInitialState: function() {
        let initialState = this.getStateFromStore();
        initialState['selectedActivity'] = 'cycling';
        return initialState;
    },

    componentDidMount: function() {
        ActivitiesStore.addChangeListener(this._onChange);
        ActivitiesActionCreator.tryLoadActivities();
    },
    
    componentWillUnMount: function() {
        ActivitiesStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        if (!this.isMounted()) {
            return;
        }

        if (ActivitiesStore.getIsLoading()) {
            // If we are still loading, re-trigger the activities fetch routine after a delay.
            setTimeout(function() {
                ActivitiesActionCreator.tryLoadActivities();
            }, 1000);
        }

        this.setState(this.getStateFromStore());
    },

    handleLogout: function(e) {
        e.preventDefault();
        LogoutActionCreator.logout();
    },

    handleActivitySelection() {
        let activity = $('[name="activity"]:checked').val();
        this.setState({
            selectedActivity: activity
        });
    },

    render() {
        if (this.state.activities === null) {
            return (
                <Loading />
            );
        } else {
            return (
                <div className="container-fluid">
                    <div className="row top-buffer">
                        <div className="col-xs-2"/>
                        <div className="col-xs-8 text-center">
                            <h1>Strava Sight</h1>
                            <p>Visualize your Strava activities in a unique bubble chart.</p>
                        </div>

                        <div className="col-xs-2">
                            <p className="text-right"><a href="" onClick={this.handleLogout}>Log out</a></p>
                        </div>
                    </div>
                    <div className="row">
                        <ActivityChart activities={this.state.activities[this.state.selectedActivity]} />
                    </div>
                    <div className="row pad-above">
                        <div className="col-xs-12 text-center">
                            <form onChange={this.handleActivitySelection}>
                                <input type="radio" name="activity" value="swimming" />
                                <label>Swimming</label>
                                <input type="radio" name="activity" value="cycling" defaultChecked />
                                <label>Cycling</label>
                                <input type="radio" name="activity" value="running" />
                                <label>Running</label>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <p>Tip: hover over an activity and click to view in Strava.</p>
                        </div>
                    </div>
                </div>
            );
        }

    }
});

module.exports = LoggedIn;