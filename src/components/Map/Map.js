import React, { Component } from 'react';
import { geoConicEqualArea, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxVal: 0,
            countyBoundaries: {}
        }
    }
    componentDidMount() {
        const { stat, dateIdx, countyBoundaries, statsForCounty } = this.props;
        console.log(stat);
        console.log(dateIdx);
        console.log(countyBoundaries);
        console.log(statsForCounty);

        // get max of all values in stat array for colorscale
        const min = 0;
        const maxVal = max(Object.values(statsForCounty).map( county => {
            return max(county[stat])
        }))
        console.log(stat, maxVal)
        

        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][stat][dateIdx]
        for (let i = 0; i < countyBoundaries.features.length; i++) {
            const geoid = countyBoundaries.features[i].properties.GEO_ID.slice(9)
            // console.log(geoid)
            countyBoundaries.features[i].properties[stat] = statsForCounty[geoid][stat]
        }
        console.log(countyBoundaries)
        this.setState({ maxVal, countyBoundaries })
        // console.log(Object.values(this.props.statsForCounty)[stat])
    }

    drawCounties = () => {
        const projection = geoConicEqualArea()
            .parallels([34, 40.5])
            .rotate([120, 0])
            .fitSize([this.props.width, this.props.height], this.state.countyBoundaries)

        const pathGenerator = geoPath().projection(projection)
	    const ramp = scaleLinear().domain([ 0, this.state.maxVal ]).range(['#ffff00','#ff0000'])

        const counties = this.state.countyBoundaries.features.map((d,i) => {
            console.log(this.props.stat, d.properties[this.props.stat][this.props.dateIdx])
            return (<path
            key={`county-boundary-${i}`}
            d={pathGenerator(d)}
            style={{
                stroke: 'lightgray',
                fill: ramp(d.properties[this.props.stat][this.props.dateIdx]),
                fillOpacity: 1
            }}
            className='counties'
        />)})
         return counties
    }

    render() {
        return (
            <svg width={this.props.width} height={this.props.height}>
                <g style={{ stroke: '#00ff00'}}>
                    <rect
                        x={0}
                        y={0}
                        width={this.props.width}
                        height={this.props.height}
                        fillOpacity={0}
                        stroke={'#00ff00'}
                        strokeWidth='1'
                    /> 
                    {this.state.countyBoundaries.features && this.drawCounties()}
                </g>
                
            </svg>
        )
    }
}

export default Map