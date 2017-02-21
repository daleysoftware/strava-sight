let React = require('react');

let ActivitiesStore = require('../stores/Activities.js');
let ActivitiesActionCreator = require('../actions/Activities.js');

let LogoutActionCreator = require('../actions/Logout.js');

let ActivityChart = require('./ActivityChart.js');

let rawData = [
    {x: 0, y: 6, r: 10},
    {x: 1, y: 5, r: 10},
    {x: 2, y: 4, r: 10},
    {x: 3, y: 3, r: 10},
    {x: 4, y: 3, r: 10},
    {x: 5, y: 2.4, r: 20},
    {x: 6, y: 2, r: 10},
];

let data = {
    datasets: [
        {
            label: "My first dataset",
            backgroundColor: "rgba(255,0,0,0.3)",
            data: rawData,
        }
    ]
};

let options = {
    responsive: true,
    maintainAspectRatio: true,
    
    title: {
        display: true,
        text: 'Pace Analysis'
    },

    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return JSON.stringify(rawData[tooltipItem['index']]);
            }
        }
    },

    scales: {
        xAxes: [{
            ticks: {
                callback: function (value, index, values) {
                    return 'value is ' + value;
                }
            },
            scaleLabel: {
                display: true,
                labelString: 'Date'
            },
        }],
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: 'Pace'
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