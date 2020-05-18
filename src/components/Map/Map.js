import React, { Component } from 'react';

class Map extends Component {
    componentDidMount() {
        // const { stat, dateIdx, countyBoundaries, statsForCounty } = this.props;
        // console.log(stat);
        // console.log(dateIdx);
        // console.log(countyBoundaries);
        // console.log(statsForCounty);

        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][stat][dateIdx]
    }

    render() {
        return (
            <div>
                <p>{this.props.stat}</p>
                <p>{this.props.dateIdx}</p>
            </div>
        )
    }
}

export default Map