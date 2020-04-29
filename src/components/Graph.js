import React, { Component } from 'react'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { line } from 'd3-shape'
import { max, extent, bisectLeft, least } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import { timeFormat } from 'd3-time-format'
import { select } from 'd3-selection'
import { easeCubicOut } from 'd3-ease'
import { transition } from 'd3-transition'
import { addCommas } from '../utils/utils.js'
import { COLORS } from '../store/constants.js'


const margin = { top: 20, right: 40, bottom: 30, left: 80 };
const red = '#d31d30';
const green = '#4ddaba';
const blue = '#1f90db';
const gray = '#9b9b9b';

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            series: this.props.series,
            dates: this.props.dates,
            statThreshold: this.props.statThreshold,
            xScale: scaleUtc().range([margin.left, this.props.width - margin.right]),
            yScale: scaleLinear().range([this.props.height - margin.bottom, margin.top]),
            lineGenerator: line().defined(d => !isNaN(d)),
            simPaths: [],
            hoveredSimPathId: null,
        };
        this.xAxisRef = React.createRef();
        this.xAxis = axisBottom().scale(this.state.xScale)
            // .tickFormat(timeFormat('%b'))
            .ticks(this.state.width / 80).tickSizeOuter(0);

        this.yAxisRef = React.createRef();
        this.yAxis = axisLeft().scale(this.state.yScale)
            .tickFormat(d => addCommas(d));
        
        this.simPathsRef = React.createRef();
        this.thresholdRef = React.createRef();
    }
    
    componentDidMount() {
        // console.log(this.state.series)
        this.drawSimPaths(this.state.series, this.state.dates);

        if (this.xAxisRef.current) {
            select(this.xAxisRef.current).call(this.xAxis)
        }
        if (this.yAxisRef.current) {
            select(this.yAxisRef.current).call(this.yAxis).call(g => g.select(".domain").remove());
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(prevProps, this.props)
        // console.log('prev series different from new series is ', this.props.series !== prevProps.series)
        // console.log('prev dates different from new dates is ', this.props.dates !== prevProps.dates)
        // console.log('prev statThreshold', prevProps.statThreshold, 'new statThreshold', this.props.statThreshold)
       
        // compare prevProps series or dates to newProps series or dates
        if (this.props.series !== prevProps.series || this.props.dates !== prevProps.dates) {
            const { series, dates, statThreshold } = this.props;
            const { xScale, yScale, lineGenerator, width, height } = prevState;

            if (this.simPathsRef.current) {
                
                // update scale and data
                const updatedScales = this.calculateSimPaths(series, dates)
              
                // generate simPaths from lineGenerator
                const simPaths = series.map( (d,i) => {
                    // console.log(i, typeof(d.vals))
                    return lineGenerator(d.vals)
                })
              
                // get svg node
                const simPathsNode = select(this.simPathsRef.current)
                // console.log(simPathsNode.selectAll('.simPath'))
                // update the paths with new data
                simPathsNode.selectAll('.simPath')
                    .data(series)
                    .transition()
                    .duration(1000)
                    .ease(easeCubicOut)
                    .attr("d", d => updatedScales.lineGenerator(d.vals))
                    .attr("stroke", (d,i) => series[i].over ? COLORS['red'] : COLORS['green'] )
                    .on("end", () => {
                        // set new vals to state
                        this.setState({ 
                            series: series,
                            dates: dates,
                            xScale: updatedScales.xScale,
                            yScale: updatedScales.yScale,
                            lineGenerator: updatedScales.lineGenerator,
                            simPaths: simPaths,
                        })
                    })
            }

            // Update statThresholdLine
            if (this.thresholdRef.current) {
                const thresholdNode = select(this.thresholdRef.current)
                thresholdNode.selectAll('.statThreshold')
                    .transition()
                    .duration(1000)
                    .attr("y1", yScale(statThreshold))
                    .attr("y2", yScale(statThreshold))
                    .ease(easeCubicOut)
                    .on("end", () => {
                        this.setState({ statThreshold })
                    })
            }

            // Update Axes
            if (this.xAxisRef.current) {
                //update xAxis
                const xAxisNode = select(this.xAxisRef.current)
                xAxisNode
                    .transition()
                    .duration(1000)
                    .call(this.xAxis);
            }
            if (this.yAxisRef.current) {
                // update yAxis
                const yAxisNode = select(this.yAxisRef.current)
                yAxisNode
                    .transition()
                    .duration(1000)
                    .call(this.yAxis)
                    .call(g => g.select(".domain").remove());
            }
        }
    }

    calculateSimPaths = (series, dates) => {
        // draw the sims first here (without transitioning)
        const { xScale, yScale, lineGenerator, width, height } = this.state;
        // calculate scale domains
        const timeDomain = extent(dates);
        const maxVal = max(series, sims => max(sims.vals))
        // set scale ranges to width and height of container
        xScale.range([margin.left, width - margin.right])
        yScale.range([height - margin.bottom, margin.top])
        // set scale domains and lineGenerator domains
        xScale.domain(timeDomain);
        yScale.domain([0, maxVal]).nice();
        lineGenerator.x((d,i) => xScale(dates[i]))
        lineGenerator.y(d => yScale(d))

        return { xScale, yScale, lineGenerator }
    }

    drawSimPaths = (series, dates) => {
        const { xScale, yScale, lineGenerator, width, height } = this.state;
        const updatedScales = this.calculateSimPaths(series, dates);
        // generate simPaths from lineGenerator
        const simPaths = series.map( (d,i) => {
            // console.log(i, typeof(d.vals))
            return lineGenerator(d.vals)
        })
        // set new vals to state
        this.setState({ 
            series: series,
            dates: dates,
            xScale: updatedScales.xScale,
            yScale: updatedScales.yScale,
            lineGenerator: updatedScales.lineGenerator,
            simPaths: simPaths,
        })
    }

    handleMouseMove = (event, index) => {
        // console.log(index)
        // console.log(clientPoint(event.target, event))
        this.setState({ hoveredSimPathId: index })
    }

    handleMouseEnter = (event, index) => {
        this.setState({ hoveredSimPathId: index })
    }

    handleMouseLeave = (event, index) => {
        this.setState({ hoveredSimPathId: null })
    }

    render() {
        // console.log(this.props.stat, this.props.scenario, this.props.yAxisLabel)
        // console.log(this.state.series)
        // console.log(this.props.statThreshold)
        return (
            <div className="graph-wrapper">
                <div className="y-axis-label">
                    {this.props.yAxisLabel}
                </div>
                <svg 
                    width={this.state.width} 
                    height={this.state.height} 
                    ref={this.simPathsRef}
                >
                <g>
                {
                // visible simPaths
                this.state.simPaths.map( (simPath, i) => {
                    return <path
                        d={simPath}
                        key={`simPath-${i}`}
                        id={`simPath-${i}`}
                        className={`simPath`}
                        fill='none' 
                        stroke = { this.state.series[i].over ? COLORS['red'] : COLORS['green'] }
                        strokeWidth={'1'}
                        strokeOpacity={ this.state.hoveredSimPathId ? 0 : 0.6}
                        onMouseMove={(e) => this.handleMouseMove(e, i)}
                        onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                        onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                    />
                })}
                {// highlight simPaths
                this.state.hoveredSimPathId &&
                this.state.simPaths.map( (simPath, i) => {
                    const simIsHovered = (i === this.state.hoveredSimPathId)
                    return <path
                        d={simPath}
                        key={`simPath-${i}-hover`}
                        id={`simPath-${i}-hover`}
                        className={`simPath-hover`}
                        fill='none' 
                        stroke={simIsHovered ? COLORS['blue'] : COLORS['gray']}
                        strokeWidth={simIsHovered ? '2' : '1'}
                        strokeOpacity={simIsHovered && this.state.hoveredSimPathId ? 1 : 0.5}
                        onMouseMove={(e) => this.handleMouseMove(e, i)}
                        onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                        onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                    />
                })}
                <g ref={this.thresholdRef}>
                <line
                    x1={this.state.xScale(this.state.dates[0])}
                    y1={this.state.yScale(this.state.statThreshold)}
                    x2={this.state.xScale(this.state.dates[this.state.dates.length - 1])}
                    y2={this.state.yScale(this.state.statThreshold)}
                    stroke={COLORS['gray']}
                    className={'statThreshold'}
                ></line>
                </g>
                </g>
                <g>
                    <g ref={this.xAxisRef} transform={`translate(0, ${this.state.height - margin.bottom})`} />
                    <g ref={this.yAxisRef} transform={`translate(${margin.left}, 0)`} />
                </g>
                </svg>
            </div>
        )
    }
}

export default Graph