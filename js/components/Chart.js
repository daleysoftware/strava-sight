let React = require('react');
let ChartJS = require('chart.js');


let Chart = React.createClass({
    componentDidMount () {
        let chartCanvas = this.refs.chart;

        let myChart = new ChartJS(chartCanvas, {
            type: 'line',
            data: this.props.data,
            options: this.props.options
        });

        this.setState({chart: myChart});
    },

    render () {
        return (
            <div className="charts">
                <canvas ref={'chart'} />
            </div>
        );
    }
});

module.exports = Chart;
