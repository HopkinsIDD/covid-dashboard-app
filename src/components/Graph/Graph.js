import React, { Component } from 'react'
import Axis from './Axis'
// import { scaleLinear, scaleUtc } from 'd3-scale'
import { line } from 'd3-shape'
// import { max, extent } from 'd3-array'
import { select } from 'd3-selection'
import { easeCubicOut } from 'd3-ease'
import { transition } from 'd3-transition'
import { margin, red, green, blue, gray, lightgray } from '../../utils/constants'

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            series: this.props.series,
            dates: this.props.dates,
            statThreshold: this.props.statThreshold,
            dateThreshold: this.props.dateThreshold,
            dateRange: this.props.dateRange,
            xScale: this.props.xScale,
            yScale: this.props.yScale,
            lineGenerator: line().defined(d => !isNaN(d)),
            simPaths: [],
            hoveredSimPathId: null,
        };
        
        this.simPathsRef = React.createRef();
        this.thresholdRef = React.createRef();
    }
    
    componentDidMount() {
        console.log(this.props.keyVal, 'ComponentDidMount')
        // console.log('ComponentDidMount')
        // console.log(this.state.series)
        this.drawSimPaths(this.state.series, this.state.dates);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('ComponentDidUpdate', this.props.keyVal)
        console.log('series has changed is', this.props.series !== prevProps.series)
        console.log('statThreshold has changed is', this.props.statThreshold !== prevProps.statThreshold)

        if (this.props.series !== prevProps.series && this.props.brushActive) {
            console.log('brushing is TRUE, series diff', this.props.keyVal)
            const { series, dates, statThreshold, dateThreshold, width, xScale, yScale } = this.props;
            const { lineGenerator } = prevState;
            //TODO: update based on resizing width and height

            this.updateSimPaths(series, dates, lineGenerator, true, width);
            // this.updateThresholdIndicators(statThreshold, dateThreshold, xScale, yScale);
        }

        if (this.props.series !== prevProps.series && !this.props.brushActive) {
            console.log('brushing is FALSE, series diff', this.props.keyVal)
            const { series, dates, statThreshold, dateThreshold, width, xScale, yScale } = this.props;
            const { lineGenerator } = prevState;
            //TODO: update based on resizing width and height
            

            this.updateSimPaths(series, dates, lineGenerator, false, width);
            // this.updateThresholdIndicators(statThreshold, dateThreshold, xScale, yScale);
        }

        if (!this.props.brushActive && (this.props.statThreshold !== prevProps.statThreshold || this.props.dateThreshold !== prevProps.dateThreshold)) {
            console.log('threshold diff', this.props.keyVal)
            const { series, dates, statThreshold, dateThreshold, width, xScale, yScale } = this.props;
            const { lineGenerator } = prevState;
            //TODO: update based on resizing width and height
            

            this.updateSimPaths(series, dates, lineGenerator, true, width);
            // this.updateThresholdIndicators(statThreshold, dateThreshold, xScale, yScale);
        }
    }

    drawSimPaths = (series, dates) => {
        const { lineGenerator } = this.state;
        const { xScale, yScale } = this.props;
        
        // move this lineGenerator update in from calculateSimPaths
        // and use scales passed in from GraphContainer
        lineGenerator.x((d,i) => xScale(dates[i]))
        lineGenerator.y(d => {
            // console.log(d)
            // console.log(yScale(d))
            return yScale(d)
        })
        // const updatedScales = this.calculateSimPaths(series, dates);
        // generate simPaths from lineGenerator
        const simPaths = series.map( (d,i) => {
            // console.log(i, typeof(d.vals))
            return lineGenerator(d.vals)
        })
        // set new vals to state
        this.setState({ 
            series: series,
            dates: dates,
            xScale: xScale,
            yScale: yScale,
            lineGenerator: lineGenerator,
            simPaths: simPaths,
        })
    }

    updateSimPaths = (series, dates, lineGenerator, brushed, width) => {
        //Animate simPath color but don't change data
        if (this.simPathsRef.current) {
                
            // update lineGenerator from new scale and data
            lineGenerator.x((d,i) => this.props.xScale(dates[i]))
            lineGenerator.y(d => this.props.yScale(d))
          
            // generate simPaths from lineGenerator
            const simPaths = series.map( (d,i) => {
                // console.log(i, typeof(d.vals))
                return lineGenerator(d.vals)
            })
          
            // get svg node
            const simPathsNode = select(this.simPathsRef.current)

            if (brushed) {
                simPathsNode.selectAll('.simPath')
                    .data(series)
                    .attr("d", d => lineGenerator(d.vals))
                    .attr("stroke", (d,i) => series[i].over ? red : green )
                    .on("end", () => {
                        // set new vals to state
                        this.setState({ 
                            series: series,
                            dates: dates,
                            xScale: this.props.xScale,
                            yScale: this.props.yScale,
                            lineGenerator: lineGenerator,
                            simPaths: simPaths,
                            width: width
                        })
                    })
                    simPathsNode.selectAll('.simPath-hover')
                        .data(series)
                        .attr("d", d => lineGenerator(d.vals))
            } else {
                simPathsNode.selectAll('.simPath')
                    .data(series)
                    .transition()
                    .duration(1000)
                    .ease(easeCubicOut)
                    .attr("d", d => lineGenerator(d.vals))
                    .attr("stroke", (d,i) => series[i].over ? red : green )
                    .on("end", () => {
                        // set new vals to state
                        this.setState({ 
                            series: series,
                            dates: dates,
                            xScale: this.props.xScale,
                            yScale: this.props.yScale,
                            lineGenerator: lineGenerator,
                            simPaths: simPaths,
                            width
                        })
                    })
                    simPathsNode.selectAll('.simPath-hover')
                        .data(series)
                        .attr("d", d => lineGenerator(d.vals))
            } 
        }
    }

    updateThresholdIndicators = (statThreshold, dateThreshold, xScale, yScale) => {
        // this.updateStatThresholdLine(statThreshold, yScale);
        // this.updateDateThresholdLine(dateThreshold, xScale);
        // this.updateThresholdCircle(statThreshold, dateThreshold, xScale, yScale);
        if (this.thresholdRef.current) {
            const thresholdNode = select(this.thresholdRef.current)
            thresholdNode.selectAll('.thresholdCircle')
                .transition()
                .duration(500)
                .attr("cx", xScale(dateThreshold))
                .attr("cy", yScale(statThreshold))
                .ease(easeCubicOut)
                .on("end", () => {
                    console.log('circleThreshold transition ended')
                    // this.setState({ dateThreshold })
                })
            thresholdNode.selectAll('.statThreshold')
                .transition()
                .duration(500)
                .attr("y1", yScale(statThreshold))
                .attr("y2", yScale(statThreshold))
                .ease(easeCubicOut)
                .on("end", () => {
                    console.log('statThreshold transition ended')
                    this.setState({ statThreshold })
                })
            thresholdNode.selectAll('.dateThreshold')
                .transition()
                .duration(500)
                .attr("x1", xScale(dateThreshold))
                .attr("x2", xScale(dateThreshold))
                .ease(easeCubicOut)
                .on("end", () => {
                    console.log('dateThreshold transition ended')
                    this.setState({ dateThreshold })
                })
        }
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

        return (
            // <div className="graph-area">
                <g 
                    width={this.state.width} 
                    height={this.state.height}
                    transform={`translate(${this.props.x}, ${this.props.y})`}
                    ref={this.simPathsRef}
                >
                    <g>
                        
                        <rect 
                            x={margin.left}
                            y={margin.top}
                            width={this.state.width - margin.left - margin.right}
                            height={this.state.height - margin.bottom - margin.top}
                            fill={'#f6f5f5'}
                        />
                        <rect
                            x={0}
                            y={0}
                            width={this.state.width}
                            height={this.state.height}
                            // fill={'#ff0000'}
                            fillOpacity={0}
                            stroke={'#ff0000'}
                            strokeWidth='2'
                        />
                        {
                        // visible simPaths
                        this.state.simPaths.map( (simPath, i) => {
                            return <path
                                d={simPath}
                                key={`simPath-${i}`}
                                id={`simPath-${i}`}
                                className={`simPath`}
                                fill='none' 
                                stroke = { this.state.series[i].over ? red : green}
                                strokeWidth={'1'}
                                strokeOpacity={ this.state.hoveredSimPathId ? 0 : 0.6}
                                onMouseMove={(e) => this.handleMouseMove(e, i)}
                                onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                            />
                        })}
                        {// highlight simPaths
                        this.state.simPaths.map( (simPath, i) => {
                            const simIsHovered = (i === this.state.hoveredSimPathId)
                            return <path
                                d={simPath}
                                key={`simPath-${i}-hover`}
                                id={`simPath-${i}-hover`}
                                className={`simPath-hover`}
                                fill='none' 
                                stroke={simIsHovered ? blue : lightgray}
                                strokeWidth={simIsHovered ? '2' : '1'}
                                strokeOpacity={this.state.hoveredSimPathId ? 1 : 0}
                                onMouseMove={(e) => this.handleMouseMove(e, i)}
                                onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                            />
                        })}
                        <g ref={this.thresholdRef}>
                            <line
                                x1={margin.left}
                                y1={this.props.yScale(this.props.statThreshold) < margin.top ? margin.top : this.props.yScale(this.props.statThreshold)}
                                x2={this.props.width - margin.right}
                                y2={this.props.yScale(this.props.statThreshold) < margin.top ? margin.top : this.props.yScale(this.props.statThreshold)}
                                stroke={gray}
                                className={'statThreshold'}
                                strokeDasharray="4 2"
                            ></line>
                            <line
                                x1={this.props.xScale(this.props.dateThreshold) < margin.left ? margin.left : this.props.xScale(this.props.dateThreshold)}
                                y1={margin.top}
                                x2={this.props.xScale(this.props.dateThreshold) < margin.left ? margin.left : this.props.xScale(this.props.dateThreshold)}
                                y2={this.props.height - margin.bottom}
                                stroke={gray}
                                className={'dateThreshold'}
                                strokeDasharray="4 2"
                            ></line>
                            <circle
                                cx={this.props.xScale(this.props.dateThreshold)}
                                cy={this.props.yScale(this.props.statThreshold)}
                                r={4}
                                fill={gray}
                                className={'thresholdCircle'}
                            ></circle>
                        </g>
                    </g>
                    <g>
                        <Axis 
                            keyVal={this.props.keyVal}
                            ref={this.axisRef}
                            width={this.state.width}
                            height={this.state.height}
                            orientation={'bottom'}
                            scale={this.props.xScale}
                            x={0}
                            y={this.state.height - margin.bottom}
                        />
                    </g>
                </g>
            // </div>
        )
    }
}

export default Graph