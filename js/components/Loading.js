let React = require('react');

let Loading = React.createClass({

    render() {
        return (
            <div className="vertical-center">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4 className="text-center center-block">Loading...</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Loading;