import React, { Component } from 'react';

class Map extends Component {
    componentDidMount() {
        console.log(this.props.stat);
        console.log(this.props.dateThreshold);
        console.log(this.props.countyBoundaries);
        console.log(this.props.statsForCounty);
    }

    render() {
        return (
            <div>
                <p>Map</p>
                <p>{this.props.stat}</p>
            </div>
        )
    }
}

export default Map