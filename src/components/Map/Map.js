import React, { Component, Fragment } from 'react';
import { geoConicEqualArea, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisRight } from 'd3-axis';
import { select } from 'd3-selection';
import _ from 'lodash';
import { Tooltip } from 'antd';
import Axis from '../Graph/Axis';

import { gray, lightgray } from '../../utils/constants';
import { addCommas } from '../../utils/utils';


const legendW = 60;
// const lowColor = '#f9f9f9'
// const highColor = '#e6550d'
const gradientMargin = 30;

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minVal: 0,
            maxVal: 0,
            countyBoundaries: {},
            yScale: scaleLinear(),
            countyIsHovered: false,
            hoveredCounty: null,
            tooltipText: ''
        }
        this.axisRef = React.createRef();
        this.tooltipRef = React.createRef();
    }
    componentDidMount() {
        this.calculateScales();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.countyBoundaries !== this.props.countyBoundaries ||
            prevProps.statsForCounty !== this.props.statsForCounty ||
            prevProps.scenario !== this.props.scenario) {
                this.calculateScales();
        }
    }

    calculateScales = () => {
        const { stat, countyBoundaries, statsForCounty, scenario } = this.props;
        // console.log(stat);
        // console.log(dateIdx);
        // console.log(countyBoundaries);
        // console.log(geoid);
        // console.log(statsForCounty);
        // console.log(scenario);
        const normalizedStatsAll = []
        
        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][scenario][stat][dateIdx]
        for (let i = 0; i < countyBoundaries.features.length; i++) {
            // console.log(countyBoundaries.features[i].properties)
            const geoid = countyBoundaries.features[i].properties.geoid;
            const population = countyBoundaries.features[i].properties.population;
            // console.log(geoid)
            // check to see if stats exist for this county
            if (statsForCounty[geoid]) {
                const statArray = statsForCounty[geoid][scenario][stat]
                const normalizedStatArray = statArray.map( value => {
                    return (value / population) * 10000
                })
                normalizedStatsAll.push(normalizedStatArray)
                countyBoundaries.features[i].properties[stat] = statArray
                countyBoundaries.features[i].properties[`${stat}Norm`] = normalizedStatArray
            } else {
                countyBoundaries.features[i].properties[stat] = []
                countyBoundaries.features[i].properties[`${stat}Norm`] = []
            }
        }
        // get max of all values in stat array for colorscale
        const maxVal = max(Object.values(statsForCounty).map( county => {
            // return max(county[stat])
            return max(county[scenario][stat])
        }))
        const minVal = maxVal * 0.3333;

        const maxValNorm = max(normalizedStatsAll.map( val => {
            return max(val)
        }))
        // console.log(maxValNorm)
        const minValNorm = maxValNorm * 0.3333;
        // console.log(stat, maxVal)
        const yScale = scaleLinear().range([(this.props.height - (2 * gradientMargin))/2, 0]).domain([0, maxValNorm])
        this.axis = axisRight().scale(yScale)
        
        if (this.axisRef.current) {
            select(this.axisRef.current).call(this.axis)
        }
        // console.log(countyBoundaries)
        this.setState({ minVal, maxVal, countyBoundaries, yScale, minValNorm, maxValNorm })
        // console.log(Object.values(this.props.statsForCounty)[stat])
    }

    drawCounties = () => {
        // console.log(this.state.countyBoundaries)
        // optimize projection for CA or NY
        const parallels = (this.props.geoid.slice(0,2) === '06') ? [34, 40.5] : [40.5, 41.5]
        const rotation = (this.props.geoid.slice(0,2) === '06') ? [120, 0] : [74, 0]
        
        const projection = geoConicEqualArea()
            .parallels(parallels)
            .rotate(rotation)
            .fitSize([this.props.width - legendW, this.props.height * 0.75], this.state.countyBoundaries)

        const pathGenerator = geoPath().projection(projection)
	    const ramp = scaleLinear().domain([ 0, this.state.maxValNorm ]).range([this.props.lowColor, this.props.highColor])

        const counties = this.state.countyBoundaries.features.map((d,i) => {
            // console.log(this.props.stat, d.properties[this.props.stat][this.props.dateIdx])
            return (
                <Tooltip
                    key={`tooltip-county-boundary-${i}`}
                    title={this.state.tooltipText}
                    visible={this.state.hoveredCounty === d.properties.geoid && this.state.countyIsHovered ? true : false}
                    data-html="true"
                >
                    <path
                        key={`county-boundary-${i}`}
                        d={pathGenerator(d)}
                        style={{
                            stroke: (this.state.hoveredCounty === d.properties.geoid) || (this.props.geoid === d.properties.geoid) ? this.props.highColor : gray,
                            strokeWidth: (this.state.hoveredCounty === d.properties.geoid) || (this.props.geoid === d.properties.geoid) ? 2 : 1,
                            fill: d.properties[`${this.props.stat}Norm`].length > 0 ? ramp(d.properties[`${this.props.stat}Norm`][this.props.dateIdx]) : lightgray,
                            fillOpacity: 1,
                            cursor: 'pointer'
                        }}
                        className='counties'
                        onMouseEnter={(e) => this.handleCountyEnter(e, d)}
                        onMouseLeave={() => this.handleCountyLeave(d)}
                        onMouseDown={() => this.handleCountyLeave(d)}
                    />
                </Tooltip>
            )})
         return counties
    }

    handleCountyEnter = _.debounce((event, feature) => {
        event.preventDefault()
        // console.log('entered', feature.properties.name)
        // console.log(feature)
        let statInfo = ''
        if (feature.properties[this.props.stat].length > 0) {
            statInfo = `${this.props.statLabel}: ${addCommas(feature.properties[this.props.stat][this.props.dateIdx])}`
        } else {
            statInfo = 'No Indicator Data'
        }
        const text = `${feature.properties.name} County <br>
                    Population: ${addCommas(feature.properties.population)} <br>
                    ${statInfo}`

        const tooltipText = () =>  (<div dangerouslySetInnerHTML={{__html: text}}></div>)

        this.setState({ hoveredCounty: feature.properties.geoid, countyIsHovered: true, tooltipText })
    }, 100)

    handleCountyLeave = _.debounce(() => {
        // console.log('left', feature.properties.name)
        this.setState({ hoveredCounty: null, countyIsHovered: false })
    }, 100)

    drawLegend = () => {
        // const legendW = 100;
        // const legendH = this.props.height/2;
        
    }

    render() {
        return (
            <Fragment>
                <div className='titleNarrow map-title'>{`${this.props.statLabel} per 10K people`}</div>
                <svg width={legendW} height={this.props.height/1.5}>
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
                            <stop offset="0%" stopColor={this.props.highColor} stopOpacity="1"></stop>
                            {/* <stop offset="33%" stopColor="#bae4bc" stopOpacity="1"></stop>
                            <stop offset="66%" stopColor="#7bccc4" stopOpacity="1"></stop> */}
                            <stop offset="100%" stopColor={this.props.lowColor} stopOpacity="1"></stop>
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
                    <Axis 
                        // keyVal={this.props.keyVal}
                        width={legendW/2}
                        height={this.props.height - (2 * gradientMargin)}
                        orientation={'right'}
                        scale={this.state.yScale}
                        x={legendW/2}
                        y={this.props.height - gradientMargin}
                    />
                </svg>
                <svg width={this.props.width - legendW} height={this.props.height * 0.75} className={`mapSVG-${this.props.stat}`}>
                    <g style={{ stroke: '#00ff00'}}>
                        {/* debug green svg */}
                        {/* <rect
                            x={0}
                            y={0}
                            width={this.props.width - legendW}
                            height={this.props.height * 0.75}
                            fillOpacity={0}
                            stroke={'#00ff00'}
                            strokeWidth='1'
                        />  */}
                        {this.state.countyBoundaries.features && this.drawCounties()}
                    </g>
                </svg>
            </Fragment>
            
        )
    }
}

export default Map