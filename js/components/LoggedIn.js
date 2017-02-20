let React = require('react');

let LogoutActionCreator = require('../actions/Logout.js');
let Chart = require('./Chart.js');

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
                <Chart data={data} options={options} />
                <p><a href="" onClick={this.handleLogout}>Log out</a></p>
            </div>
        )
    }
});

module.exports = LoggedIn;