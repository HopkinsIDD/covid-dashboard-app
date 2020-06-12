import React, { Component, Fragment } from 'react';
import { geoConicEqualArea, geoPath } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import _ from 'lodash';
import { Tooltip } from 'antd';
import Axis from '../Graph/Axis';

import { addCommas } from '../../utils/utils';
import colors, { gray } from '../../utils/colors';

const legendW = 60;
const gradientMargin = 20;
const gradientW = legendW/4;

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
        this.tooltipRef = React.createRef();
    }
    componentDidMount() {
        const gradientH = (this.props.width - gradientMargin) / 2;
        this.setState({ gradientH }, () => this.calculateScales());
        window.addEventListener('scroll', this.handleWindowScrollTooltip)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.countyBoundaries !== this.props.countyBoundaries ||
            prevProps.statsForCounty !== this.props.statsForCounty ||
            prevProps.scenario !== this.props.scenario) {
                const gradientH = (this.props.width - gradientMargin) / 2;
                this.setState({ gradientH }, () => this.calculateScales());
                
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll')
    }

    calculateScales = () => {
        const { stat, countyBoundaries, statsForCounty, scenario } = this.props;
        const normalizedStatsAll = []
        
        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][scenario][stat][dateIdx]
        for (let i = 0; i < countyBoundaries.features.length; i++) {
            const geoid = countyBoundaries.features[i].properties.geoid;
            const population = countyBoundaries.features[i].properties.population;
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
        // console.log(this.state.gradientH)
        const yScale = scaleLinear().range([this.state.gradientH, 0]).domain([0, maxValNorm])
        // console.log(countyBoundaries)
        this.setState({ minVal, maxVal, countyBoundaries, yScale, minValNorm, maxValNorm })
        // console.log(Object.values(this.props.statsForCounty)[stat])
    }

    drawCounties = () => {
        // console.log('drawing counties')
        // console.log(this.state.countyBoundaries)
        // optimize projection for CA or NY
        // TODO add to constants file for other states
        const parallels = (this.props.geoid.slice(0,2) === '06') ? [34, 40.5] : [40.5, 41.5]
        const rotation = (this.props.geoid.slice(0,2) === '06') ? [120, 0] : [74, 0]
        
        const projection = geoConicEqualArea()
            .parallels(parallels)
            .rotate(rotation)
            .fitSize([this.props.width - legendW, this.props.height], this.state.countyBoundaries)

        const pathGenerator = geoPath().projection(projection)
	    const ramp = scaleLinear().domain([ 0, this.state.maxValNorm ]).range([this.props.lowColor, this.props.highColor])

        const counties = this.state.countyBoundaries.features.map((d,i) => {
            // console.log(this.props.stat, d.properties[this.props.stat][this.props.dateIdx])
            return (
                <Tooltip
                    key={`tooltip-county-boundary-${i}`}
                    title={this.state.tooltipText}
                    visible={this.state.hoveredCounty === d.properties.geoid}
                    data-html="true"
                    // onVisibleChange={(e) => console.log('visibility change', e)}
                    destroyTooltipOnHide={true}
                >
                    <path
                        key={`county-boundary-${i}`}
                        d={pathGenerator(d)}
                        style={{
                            stroke: (this.state.hoveredCounty === d.properties.geoid) || (this.props.geoid === d.properties.geoid) ? this.props.highColor : gray,
                            strokeWidth: (this.state.hoveredCounty === d.properties.geoid) || (this.props.geoid === d.properties.geoid) ? 2 : 1,
                            fill: d.properties[`${this.props.stat}Norm`].length > 0 ? ramp(d.properties[`${this.props.stat}Norm`][this.props.dateIdx]) : colors.lightgray,
                            fillOpacity: 1,
                            cursor: 'pointer'
                        }}
                        className='counties'
                        onMouseEnter={() => this.handleCountyEnter(d)}
                        onMouseLeave={() => this.handleCountyLeave(d)}
                    />
                </Tooltip>
            )})
         return counties
    }

    handleCountyEnter = _.debounce((feature) => {
        const tooltips = document.querySelectorAll('.ant-tooltip')
        tooltips.forEach(tooltip => {
            // console.log(tooltip)
            tooltip.style.visibility = "hidden"
        })
        // console.log('ENTERED', feature.properties.name, feature.properties.geoid)
        // console.log('countyIsHovered', this.state.countyIsHovered, 'hoveredCounty', this.state.hoveredCounty)
        // event.preventDefault()
        if (this.state.hoveredCounty !== feature.properties.geoid) {
            this.setState({ hoveredCounty: null, countyIsHovered: false })
        }
        
        // console.log(feature)
        if (!this.state.countyIsHovered) {
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
        }
    }, 10)

    handleCountyLeave = _.debounce((feature) => {
        const tooltips = document.querySelectorAll('.ant-tooltip')
        tooltips.forEach(tooltip => {
            // console.log(tooltip)
            tooltip.style.visibility = "hidden"
        })
        // console.log('LEFT', feature.properties.name, feature.properties.geoid)
        // console.log('countyIsHovered', this.state.countyIsHovered, 'hoveredCounty', this.state.hoveredCounty)
        if (this.state.hoveredCounty === feature.properties.geoid) {
            this.setState({ hoveredCounty: null, countyIsHovered: false })
        }
        
    }, 10)

    handleMouseMove = () => {
        this.setState({ hoveredCounty: null, countyIsHovered: false })
    }

    drawLegend = () => {
        // const legendW = 100;
        // const legendH = this.props.height/2;
        
    }

    render() {
        return (
            <Fragment>
                <div className='titleNarrow map-title'>{`${this.props.statLabel} per 10K people`}</div>
                <svg width={legendW} height={this.props.height}>
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
                        width={gradientW}
                        height={this.state.gradientH}
                        transform={`translate(0, ${gradientMargin})`}
                        style={{ fill: `url(#map-legend-gradient-${this.props.stat}` }}
                    >
                    </rect>
                    <Axis 
                        width={gradientW}
                        height={this.state.gradientH}
                        orientation={'right'}
                        scale={this.state.yScale}
                        x={gradientW}
                        y={gradientMargin}
                    />
                </svg>
                <svg 
                    width={this.props.width - legendW}
                    height={this.props.height}
                    className={`mapSVG-${this.props.stat}`}
                >
                    <g style={{ stroke: '#00ff00'}}>
                        {/* debug green svg */}
                        <rect
                            x={0}
                            y={0}
                            width={this.props.width - legendW}
                            height={this.props.height}
                            fillOpacity={0}
                            stroke={'#00ff00'}
                            strokeWidth='1'
                            strokeOpacity={0}
                            onMouseMove={this.handleMouseMove}
                            // onMouseEnter={() => console.log('mouseenter')}
                            onMouseLeave={this.handleMouseMove}
                        /> 
                        {this.state.countyBoundaries.features && this.drawCounties()}
                    </g>
                </svg>
            </Fragment>
            
        )
    }
}

export default Map