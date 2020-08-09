import React, { Component } from 'react';
import { geoConicEqualArea, geoPath, geoMercator, geoTransverseMercator, geoConicConformal, geoAlbers } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import _ from 'lodash';
import { Tooltip } from 'antd';
import Axis from '../Graph/Axis';

import { addCommas } from '../../utils/utils';
import colors from '../../utils/colors';
import { STATEPLANES } from '../../utils/projectionSettings';

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
        this.mapRef = React.createRef();
        this.zoom = zoom()
            .scaleExtent([1,9])
            .on('zoom', this.zoomed);
    }
    componentDidMount() {
        const gradientH = (this.props.width - gradientMargin) / 2;
        this.setState({ gradientH }, () => this.calculateScales());
        if (this.mapRef.current) {
            const mapNode = select(this.mapRef.current)
            mapNode.call(this.zoom)
        }
        window.addEventListener('scroll', this.handleWindowScrollTooltip)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.countyBoundaries !== this.props.countyBoundaries ||
            prevProps.statsForCounty !== this.props.statsForCounty ||
            prevProps.scenario !== this.props.scenario) {
                const gradientH = (this.props.width - gradientMargin) / 2;
                this.setState({ gradientH }, () => this.calculateScales());
            if (this.mapRef.current) {
                const mapNode = select(this.mapRef.current)
                mapNode.call(this.zoom.transform, zoomIdentity)
            }    
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll')
    }

    calculateScales = () => {
        const { stat, countyBoundaries, statsForCounty, scenario } = this.props;
        let statArray = [];
        let normalizedStatArray = [];
        const normalizedStatsAll = []
        
        // iterate over this.props.countyBoundaries to plot up boundaries
        // join each geoid to statsForCounty[geoid][scenario][stat][dateIdx]
        for (let i = 0; i < countyBoundaries.features.length; i++) {
            const geoid = countyBoundaries.features[i].properties.geoid;
            const population = countyBoundaries.features[i].properties.population;
            // check to see if stats exist for this county
            if (statsForCounty[geoid]) {
                statArray = statsForCounty[geoid][scenario][stat.key]
                if (statArray) {
                    normalizedStatArray = statArray.map( value => {
                        return (value / population) * 10000
                    })
                    normalizedStatsAll.push(normalizedStatArray)
                } else {
                    console.log('Missing a stat key')
                }
            } 
            countyBoundaries.features[i].properties[stat.key] = statArray
            countyBoundaries.features[i].properties[`${stat.key}Norm`] = normalizedStatArray
        }
        // get max of all values in stat array for colorscale
        const maxVal = max(Object.values(statsForCounty).map( county => {
            return max(county[scenario][stat.key])
        }))
        const minVal = maxVal * 0.3333;

        const maxValNorm = max(normalizedStatsAll.map( val => {
            return max(val)
        }))
        const minValNorm = maxValNorm * 0.3333;
        const yScale = scaleLinear().range([this.state.gradientH, 0]).domain([0, maxValNorm])
        this.setState({ minVal, maxVal, countyBoundaries, yScale, minValNorm, maxValNorm })
    }

    drawCounties = () => {
        // optimize projection for CA or NY
        // TODO add to constants file for other states
        const { geoid, stat, width, height } = this.props;
        const { lowColor, highColor, dateIdx } = this.props;
        const { maxValNorm, tooltipText, hoveredCounty, countyBoundaries } = this.state;
        const statePlane = STATEPLANES[geoid.slice(0,2)]
        const parallels = STATEPLANES[geoid.slice(0,2)].parallels ? STATEPLANES[geoid.slice(0,2)].parallels : []
        const rotation = STATEPLANES[geoid.slice(0,2)].rotate ? STATEPLANES[geoid.slice(0,2)].rotate : []
        let projection
        if (statePlane.proj === 'merc') {
            projection = geoMercator()
                // .parallels(parallels)
                // .rotate(rotation)
                .fitSize([width - legendW, height], countyBoundaries)
        } else if (statePlane.proj === 'tmerc') {
            projection = geoTransverseMercator()
                // .parallels(parallels)
                .rotate(rotation)
                .fitSize([width - legendW, height], countyBoundaries)
        } else if (statePlane.proj === 'lcc'){
            projection = geoConicConformal()
                .parallels(parallels)
                .rotate(rotation)
                .fitSize([width - legendW, height], countyBoundaries)
        } else {
            // albers
            projection = geoAlbers()
                .parallels(parallels)
                .rotate(rotation)
                .fitSize([width - legendW, height], countyBoundaries)
        }

        const pathGenerator = geoPath().projection(projection)
        const ramp = scaleLinear().domain([ 0, maxValNorm ])
            .range([lowColor, highColor])

        const counties = countyBoundaries.features.map((d,i) => {
            return (
                <Tooltip
                    key={`tooltip-county-boundary-${i}`}
                    title={tooltipText}
                    visible={hoveredCounty === d.properties.geoid}
                    data-html="true"
                    destroyTooltipOnHide={true}
                >
                    <path
                        key={`county-boundary-${i}`}
                        d={pathGenerator(d)}
                        style={{
                            stroke: (hoveredCounty === d.properties.geoid) || 
                                (geoid === d.properties.geoid) ? 
                                highColor : colors.gray,
                            strokeWidth: (hoveredCounty === d.properties.geoid) || 
                                (geoid === d.properties.geoid) ? 
                                this.props.strokeHoverWidth : 
                                this.props.strokeWidth,
                            fill: d.properties[`${stat.key}Norm`].length > 0 ? 
                                ramp(d.properties[`${stat.key}Norm`][dateIdx]) : 
                                colors.lightGray,
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
        const { stat, dateIdx } = this.props;
        const tooltips = document.querySelectorAll('.ant-tooltip')
        tooltips.forEach(tooltip => {
            tooltip.style.visibility = "hidden"
        })
        if (this.state.hoveredCounty !== feature.properties.geoid) {
            this.setState({ hoveredCounty: null, countyIsHovered: false })
        }
        
        if (!this.state.countyIsHovered) {
            let statInfo = ''
            if (feature.properties[stat.key].length > 0) {
                statInfo = `${stat.name}: ${addCommas(feature.properties[stat.key][dateIdx])}`
            } else {
                statInfo = 'No Indicator Data'
            }
            const text = `${feature.properties.name} County <br>
                        Population: ${addCommas(feature.properties.population)} <br>
                        ${statInfo}`

            const tooltipText = () =>  (<div dangerouslySetInnerHTML={{__html: text}}></div>)

            this.setState({
                hoveredCounty: feature.properties.geoid, 
                countyIsHovered: true, 
                tooltipText 
            })
        }
    }, 10)

    handleCountyLeave = _.debounce((feature) => {
        const tooltips = document.querySelectorAll('.ant-tooltip')
        tooltips.forEach(tooltip => {
            tooltip.style.visibility = "hidden"
        })
        if (this.state.hoveredCounty === feature.properties.geoid) {
            this.setState({ hoveredCounty: null, countyIsHovered: false })
        }
        
    }, 10)

    handleMouseMove = () => {
        this.setState({ hoveredCounty: null, countyIsHovered: false })
    }

    zoomed = () => {
        this.props.handleZoom(event)
    }

    handleZoomIn = () => {
        if (this.mapRef.current) {
            // scale zoom on button press
            const mapNode = select(this.mapRef.current)
            this.zoom.scaleBy(mapNode.transition().duration(750), 1.2);
        }
    }

    handleZoomOut = () => {
        if (this.mapRef.current) {
            // scale zoom on button press
            const mapNode = select(this.mapRef.current)
            this.zoom.scaleBy(mapNode.transition().duration(750), 0.8);
        }
    }

    render() {
        return (
            <div className="map-parent">
                <div className='titleNarrow map-title'>{`${this.props.stat.name} per 10K people`}</div>
                <div className="map-parent">
                    <div><button className="zoom" id="zoom_in" onClick={this.handleZoomIn}>+</button></div>
                    <div><button className="zoom" id="zoom_out" onClick={this.handleZoomOut}>-</button></div>
                </div>
                <svg width={legendW} height={this.props.height}>
                    <defs>
                        <linearGradient 
                            id={`map-legend-gradient-${this.props.stat.key}`} 
                            x1="100%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                            spreadMethod="pad"
                        >
                            <stop offset="0%" stopColor={this.props.highColor} stopOpacity="1"></stop>
                            <stop offset="100%" stopColor={this.props.lowColor} stopOpacity="1"></stop>
                        </linearGradient>
                    </defs>
                    <rect
                        width={gradientW}
                        height={this.state.gradientH}
                        transform={`translate(0, ${gradientMargin})`}
                        style={{ fill: `url(#map-legend-gradient-${this.props.stat.key}` }}
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
                    className={`mapSVG-${this.props.stat.key}`}
                    ref={this.mapRef}
                >
                    <g>
                        {/* debug green svg */}
                        <rect
                            x={0}
                            y={0}
                            width={this.props.width - legendW}
                            height={this.props.height}
                            fill={colors.graphBkgd}
                            fillOpacity={0.8}
                            stroke={'#00ff00'}
                            strokeWidth='1'
                            strokeOpacity={0}
                            style={{ 'cursor': 'grab' }}
                            onMouseMove={this.handleMouseMove}
                            onMouseLeave={this.handleMouseMove}
                        /> 
                        {this.state.countyBoundaries.features && this.drawCounties()}
                    </g>
                </svg>
            </div>
            
        )
    }
}

export default Map