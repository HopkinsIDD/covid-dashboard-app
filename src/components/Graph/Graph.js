import React, { Component } from 'react'
import Axis from './Axis'
// import { scaleLinear, scaleUtc } from 'd3-scale'
import { line } from 'd3-shape'
// import { max, extent } from 'd3-array'
import { select } from 'd3-selection'
import { easeCubicOut } from 'd3-ease'
import { transition } from 'd3-transition'
import { margin, red, green, blue, gray } from '../../utils/constants'

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
        console.log('ComponentDidMount')
        console.log(this.state.series)
        this.drawSimPaths(this.state.series, this.state.dates);
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.series !== prevProps.series && this.props.brushActive) {
            console.log('in only series diff update')
            const { series, dates, statThreshold, dateThreshold } = this.props;
            const { xScale, yScale, lineGenerator } = prevState;
            //TODO: update based on resizing width and height

            this.updateSimPaths(series, dates, lineGenerator, true);
            this.updateStatThresholdLine(statThreshold, yScale);
            this.updateDateThresholdLine(dateThreshold, xScale);
        }

        if (this.props.series !== prevProps.series && !this.props.brushActive) {
            // console.log('in only series diff update')
            const { series, dates, statThreshold, dateThreshold } = this.props;
            const { xScale, yScale, lineGenerator } = prevState;
            //TODO: update based on resizing width and height

            this.updateSimPaths(series, dates, lineGenerator, false);
            this.updateStatThresholdLine(statThreshold, yScale);
            this.updateDateThresholdLine(dateThreshold, xScale);
        }
    }

    // calculateSimPaths = (series, dates) => {
    //     // console.log('in calculate sims')
    //     // draw the sims first here (without transitioning)
    //     const { xScale, yScale, lineGenerator, width, height } = this.state;
    //     // calculate scale domains
    //     const timeDomain = extent(dates);
    //     const maxVal = max(series, sims => max(sims.vals))
    //     // set scale ranges to width and height of container
    //     xScale.range([margin.left, width - margin.right])
    //     yScale.range([height - margin.bottom, margin.top])
    //     // set scale domains and lineGenerator domains
    //     xScale.domain(timeDomain);
    //     yScale.domain([0, maxVal]).nice();
    //     lineGenerator.x((d,i) => xScale(dates[i]))
    //     lineGenerator.y(d => yScale(d))

    //     return { xScale, yScale, lineGenerator }
    // }

    drawSimPaths = (series, dates) => {
        const { lineGenerator } = this.state;
        const { xScale, yScale } = this.props;
        
        // move this lineGenerator update in from calculateSimPaths
        // and use scales passed in from GraphContainer
        lineGenerator.x((d,i) => xScale(dates[i]))
        lineGenerator.y(d => yScale(d))
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

    updateSimPaths = (series, dates, lineGenerator, brushed) => {
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
                        })
                    })
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
                        })
                    })
            }
            
        }
    }

    updateStatThresholdLine = (statThreshold, yScale) => {
        // Update statThreshold Line
        if (this.thresholdRef.current) {
            const thresholdNode = select(this.thresholdRef.current)
            thresholdNode.selectAll('.statThreshold')
                .transition()
                .duration(100)
                .attr("y1", yScale(statThreshold))
                .attr("y2", yScale(statThreshold))
                .ease(easeCubicOut)
                .on("end", () => {
                    this.setState({ statThreshold })
                })
        }
    }

    updateDateThresholdLine = (dateThreshold, xScale) => {
        // Update dateThreshold Line
        if (this.thresholdRef.current) {
            const thresholdNode = select(this.thresholdRef.current)
            thresholdNode.selectAll('.dateThreshold')
                .transition()
                .duration(100)
                .attr("x1", xScale(dateThreshold))
                .attr("x2", xScale(dateThreshold))
                .ease(easeCubicOut)
                .on("end", () => {
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
                    // width={this.state.width} 
                    // height={this.state.height} 
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
                        this.state.hoveredSimPathId &&
                        this.state.simPaths.map( (simPath, i) => {
                            const simIsHovered = (i === this.state.hoveredSimPathId)
                            return <path
                                d={simPath}
                                key={`simPath-${i}-hover`}
                                id={`simPath-${i}-hover`}
                                className={`simPath-hover`}
                                fill='none' 
                                stroke={simIsHovered ? blue : gray}
                                strokeWidth={simIsHovered ? '2' : '1'}
                                strokeOpacity={simIsHovered && this.state.hoveredSimPathId ? 1 : 0.5}
                                onMouseMove={(e) => this.handleMouseMove(e, i)}
                                onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                            />
                        })}
                        <g ref={this.thresholdRef}>
                            <line
                                x1={margin.left}
                                y1={this.state.yScale(this.props.statThreshold) < margin.top ? margin.top : this.state.yScale(this.props.statThreshold)}
                                x2={this.props.width - margin.right}
                                y2={this.state.yScale(this.props.statThreshold) < margin.top ? margin.top : this.state.yScale(this.props.statThreshold)}
                                stroke={gray}
                                className={'statThreshold'}
                                strokeDasharray="4 2"
                            ></line>
                            <line
                                x1={this.state.xScale(this.props.dateThreshold) < margin.left ? margin.left : this.state.xScale(this.props.dateThreshold)}
                                y1={margin.top}
                                x2={this.state.xScale(this.props.dateThreshold) < margin.left ? margin.left : this.state.xScale(this.props.dateThreshold)}
                                y2={this.props.height - margin.bottom}
                                stroke={gray}
                                className={'dateThreshold'}
                                strokeDasharray="4 2"
                            ></line>
                            <circle
                                cx={this.state.xScale(this.props.dateThreshold)}
                                cy={this.state.yScale(this.props.statThreshold)}
                                r={4}
                                fill={gray}
                            ></circle>
                        </g>
                    </g>
                    <g>
                        <Axis 
                            width={this.state.width}
                            height={this.state.height}
                            orientation={'bottom'}
                            scale={this.state.xScale}
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