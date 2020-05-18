import React, { Component } from 'react';
import { geoAlbersUsa, geoConicEqualArea, geoPath } from 'd3-geo';

class Map extends Component {
    componentDidMount() {
        const { stat, dateIdx, countyBoundaries, statsForCounty } = this.props;
        console.log(stat);
        console.log(dateIdx);
        console.log(countyBoundaries);
        console.log(statsForCounty);

        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][stat][dateIdx]
    }

    drawCounties = () => {
        const projection = geoConicEqualArea()
            .parallels([34, 40.5])
            .rotate([120, 0])
            .fitSize([this.props.width, this.props.height], this.props.countyBoundaries)

        const pathGenerator = geoPath().projection(projection)

        const counties = this.props.countyBoundaries.features.map((d,i) => {
            console.log(d)
            return (<path
            key={`county-boundary-${i}`}
            d={pathGenerator(d)}
            style={{
                stroke: 'lightgray',
                fill: 'red',
                fillOpacity: 0.5
            }}
            className='counties'
        />)})
         return counties
    }

    render() {
        return (
            <svg width={this.props.width} height={this.props.height}>
                {this.drawCounties()}
            </svg>
        )
    }
}

export default Map