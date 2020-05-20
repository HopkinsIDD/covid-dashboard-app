import React, { Component, Fragment } from 'react';
import { geoConicEqualArea, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisRight } from 'd3-axis';
import { select } from 'd3-selection';
// import Axis from '../Graph/Axis';

const legendW = 60;
const lowColor = '#f9f9f9'
const highColor = '#e6550d'
const gradientMargin = 30;

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minVal: 0,
            maxVal: 0,
            countyBoundaries: {},
            yScale: scaleLinear()
        }
        this.axisRef = React.createRef();
    }
    componentDidMount() {
        const { stat, dateIdx, countyBoundaries, statsForCounty } = this.props;
        // console.log(stat);
        // console.log(dateIdx);
        // console.log(countyBoundaries);
        // console.log(statsForCounty);

        // get max of all values in stat array for colorscale
        
        const maxVal = max(Object.values(statsForCounty).map( county => {
            return max(county[stat])
        }))
        const minVal = maxVal * 0.3333;
        // console.log(stat, maxVal)
        
        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][stat][dateIdx]
        for (let i = 0; i < countyBoundaries.features.length; i++) {
            // console.log(countyBoundaries.features[i].properties)
            const geoid = countyBoundaries.features[i].properties.geoid
            // const geoid = countyBoundaries.features[i].properties.GEO_ID.slice(9)
            // console.log(geoid)
            countyBoundaries.features[i].properties[stat] = statsForCounty[geoid][stat]
        }
        const yScale = scaleLinear().range([(this.props.height - (2 * gradientMargin))/2, 0]).domain([minVal, maxVal])
        this.axis = axisRight().scale(yScale)
        
        if (this.axisRef.current) {
            select(this.axisRef.current).call(this.axis)
        }
        // console.log(countyBoundaries)
        this.setState({ minVal, maxVal, countyBoundaries, yScale })
        // console.log(Object.values(this.props.statsForCounty)[stat])
    }

    drawCounties = () => {
        // console.log(this.state.countyBoundaries)
        const projection = geoConicEqualArea()
            .parallels([34, 40.5])
            .rotate([120, 0])
            .fitSize([this.props.width - legendW, this.props.height * 0.75], this.state.countyBoundaries)

        const pathGenerator = geoPath().projection(projection)
	    const ramp = scaleLinear().domain([ this.state.minVal, this.state.maxVal ]).range([lowColor, highColor])

        const counties = this.state.countyBoundaries.features.map((d,i) => {
            // console.log(this.props.stat, d.properties[this.props.stat][this.props.dateIdx])
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

    drawLegend = () => {
        // const legendW = 100;
        // const legendH = this.props.height/2;
        
    }

    render() {
        return (
            <Fragment>
                <div>{this.props.statLabel}</div>
                <svg width={legendW} height={this.props.height/2}>
                     {/* debug green svg */}
                     {/* <rect
                        x={0}
                        y={0}
                        width={legendW}
                        height={this.props.height/2}
                        fillOpacity={0}
                        stroke={'#00ff00'}
                        strokeWidth='1'
                    />  */}
                    <defs>
                        <linearGradient 
                            id={`map-legend-gradient-${this.props.stat}`} 
                            x1="100%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                            spreadMethod="pad"
                        >
                            <stop offset="0%" stopColor={highColor} stopOpacity="1"></stop>
                            {/* <stop offset="33%" stopColor="#bae4bc" stopOpacity="1"></stop>
                            <stop offset="66%" stopColor="#7bccc4" stopOpacity="1"></stop> */}
                            <stop offset="100%" stopColor={lowColor} stopOpacity="1"></stop>
                        </linearGradient>
                    </defs>
                    <rect
                        width={legendW/4}
                        height={(this.props.height - (2 * gradientMargin))/ 2}
                        transform={`translate(0, ${gradientMargin/2})`}
                        style={{ fill: `url(#map-legend-gradient-${this.props.stat}` }}
                    >
                    </rect>
                    <g ref={this.axisRef}  transform={`translate(${legendW/4}, ${gradientMargin/2})`} />
                    {/* <Axis 
                        // keyVal={this.props.keyVal}
                        width={legendW/2}
                        height={this.props.height - (2 * gradientMargin)}
                        orientation={'right'}
                        scale={this.state.yScale}
                        x={legendW/2}
                        y={this.props.height - gradientMargin}
                    /> */}
                </svg>
                <svg width={this.props.width - legendW} height={this.props.height * 0.75}>
                    <g style={{ stroke: '#00ff00'}}>
                        {/* debug green svg */}
                        <rect
                            x={0}
                            y={0}
                            width={this.props.width - legendW}
                            height={this.props.height * 0.75}
                            fillOpacity={0}
                            stroke={'#00ff00'}
                            strokeWidth='1'
                        /> 
                        {this.state.countyBoundaries.features && this.drawCounties()}
                    </g>
                </svg>
            </Fragment>
            
        )
    }
}

export default Map