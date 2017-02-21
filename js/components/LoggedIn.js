let React = require('react');

let ActivitiesStore = require('../stores/Activities.js');
let ActivitiesActionCreator = require('../actions/Activities.js');

let LogoutActionCreator = require('../actions/Logout.js');

let ActivityChart = require('./ActivityChart.js');

let data = {
    labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July"
    ],
    datasets: [
        {
            label: "My first dataset",
            backgroundColor: "rgba(255,0,0,0.3)",
            data: [
                0, 1, 2, 3, 4, 5, 6
            ]
        },
        {
            label: 'My second dataset',
            backgroundColor: "rgba(0,255,0,0.3)",
            data: [
                6, 5, 4, 3, 2, 1, 0
            ]
        },
        {
            label: "My third dataset",
            backgroundColor: "rgba(0,0,255,0.3)",
            data: [
                2, 1, 5, 3, 4, 1, 0
            ]
        }
    ]
};

let options = {
    responsive: true,
    maintainAspectRatio: true,
    
    title: {
        display: true,
        text: 'Line Chart'
    },
    tooltips: {
        mode: 'label'
    },
    hover: {
        mode: 'dataset'
    },
    scales: {
        xAxes: [
            {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }
        ],
        yAxes: [
            {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }
        ]
    }
};

let LoggedIn = React.createClass({

    getStateFromStore: function() {
        return {
            activities: ActivitiesStore.getActivities(),
            loading: ActivitiesStore.getIsLoading()
        };
    },

    getInitialState: function() {
        return this.getStateFromStore();
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
            }, 5000);
        }

        let state = this.getStateFromStore();
        this.setState({state});
    },

    handleLogout: function(e) {
        e.preventDefault();
        LogoutActionCreator.logout();
    },

    render() {
        // TODO render the chart using activities and a loading screen if not loaded yet.
        return (
            <div>
                <p>Logged in!</p>
                <ActivityChart data={data} options={options} />
                <p><a href="" onClick={this.handleLogout}>Log out</a></p>
            </div>
        )
    }
});

module.exports = LoggedIn;