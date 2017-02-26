let React = require('react');

let Loading = React.createClass({

    render() {
        return (
            <div className="vertical-center">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4 className="text-center center-block">Loading...</h4>
                            <p className="text-center center-block">
                                This might take a while. <a href="https://github.com/mpillar/strava-sight/issues">Contact us</a> if needed.
                            </p>
                            <div className="center-block loader"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Loading;