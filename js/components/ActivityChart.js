let React = require('react');
let ChartJS = require('chart.js');
let Util = require('../util/Util.js');


let lastTooltipActivity = null;

let data = {
    datasets: [
        {
            label: "Swimming",
            backgroundColor: "rgba(0,0,255,0.7)",
            data: []
        },
        {
            label: "Cycling",
            backgroundColor: "rgba(255,0,0,0.7)",
            data: []
        },
        {
            label: "Running",
            backgroundColor: "rgba(0,255,0,0.7)",
            data: []
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
            label: function(tooltipItem) {
                let activity = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                lastTooltipActivity = activity;
                return 'ID: ' + activity['id'] +
                    ', Distance: ' +
                    Math.round(Util.metersToMiles(activity['distanceMeters']) * 10) / 10 + ' mi';
            }
        }
    },

    onClick: function(evt) {
        if (lastTooltipActivity !== null) {
            window.open('https://www.strava.com/activities/' + lastTooltipActivity['id']);
        }
    },

    scales: {
        xAxes: [{
            ticks: {
                callback: function (value) {
                    let utcSeconds = value;
                    var d = new Date(0);
                    d.setUTCSeconds(utcSeconds);
                    return (d.getMonth()+1) + '/' + d.getFullYear();
                }
            },
            scaleLabel: {
                display: true,
                labelString: 'Time'
            }
        }],
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: 'Pace [min/mile]'
                }
            }
        ]
    }
};

function addXYR(activities) {
    if (activities.length === 0) {
        return activities;
    }

    let maxDistance = activities[0]['distanceMeters'];
    let minDistance = activities[0]['distanceMeters'];
    activities.forEach(function(activity) {
        maxDistance = Math.max(maxDistance, activity['distanceMeters']);
        minDistance = Math.min(minDistance, activity['distanceMeters'])
    });

    // Normalize radius between 3 and 20.
    function normalizeRadius(distance, maxDistance, minDistance) {
        return (distance - minDistance) / (maxDistance - minDistance) * 17 + 3;
    }

    let result = [];
    activities.forEach(function(activity) {
        let nextResult = {
            x: activity['startDate'],
            y: Util.metersAndSecondsToMinutesPerMile(
                activity['distanceMeters'],
                activity['movingTimeSeconds']),
            r: normalizeRadius(activity['distanceMeters'], maxDistance, minDistance)
        };
        result.push(Object.assign(nextResult, activity));
    });

    return result;
}

let Chart = React.createClass({
    getInitialState: function() {
        return {
            chart: null
        };
    },
    
    componentDidMount: function() {
        let chartCanvas = this.refs.chart;
 
        let myChart = new ChartJS(chartCanvas, {
            type: 'bubble',
            data: data,
            options: options
        });

        this.setState({chart: myChart});
    },

    render () {
        data.datasets[0].data = [];
        data.datasets[1].data = [];
        data.datasets[2].data = [];

        let datasetIndex = null;
        let activities = addXYR(this.props.activities[this.props.selectedActivity]);

        switch(this.props.selectedActivity) {
            case 'swimming':
                datasetIndex = 0;
                break;
            case 'cycling':
                datasetIndex = 1;
                break;
            case 'running':
                datasetIndex = 2;
                break;
            default:
                break;
        }

        data.datasets[datasetIndex].data = activities;

        if (this.state.chart !== null) {
            this.state.chart.update();
        }

        return (
            <div className="chart center-block">
                <canvas ref={'chart'} />
            </div>
        );
    }
});

module.exports = Chart;
