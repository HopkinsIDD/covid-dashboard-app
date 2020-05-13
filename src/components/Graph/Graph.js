import React, { Component } from 'react'
import Axis from './Axis'
// import { scaleLinear, scaleUtc } from 'd3-scale'
import { line, area, curveLinear } from 'd3-shape'
import { bisectLeft, least } from 'd3-array'
import { select, clientPoint } from 'd3-selection'
import { easeCubicOut } from 'd3-ease'
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
            areaGenerator: area().curve(curveLinear),
            confBounds: this.props.confBounds,
            confBoundsAreaPath: [],
            confBoundsMeanLinePath: []
        };
        
        this.simPathsRef = React.createRef();
        this.thresholdRef = React.createRef();
        this.confBoundsRef = React.createRef();
    }
    
    componentDidMount() {
        // console.log('ComponentDidMount', this.props.keyVal)
        // console.log(this.state.series)
        this.drawSimPaths(this.state.series, this.state.dates);
        if (this.state.confBounds && this.state.confBounds.length > 0) this.drawConfBounds(this.state.confBounds, this.state.areaGenerator, this.state.dates);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('ComponentDidUpdate', this.props.keyVal)
        // confidence bounds overlay
        if (this.props.showConfBounds !== prevProps.showConfBounds && this.props.confBounds) {
            // console.log('showConfBounds is', this.props.showConfBounds)
            if (this.props.confBounds) {
                // console.log(this.props.confBounds)
                const { confBounds, dates} = this.props;
                const { areaGenerator } = prevState;
                this.updateConfBounds(confBounds, areaGenerator, dates)
            }
        }
    
        if (this.props.series !== prevProps.series && this.props.brushActive) {
            // console.log('brushing is TRUE, series diff', this.props.keyVal)
            const { series, dates, width} = this.props;
            const { lineGenerator, areaGenerator } = prevState;

            this.updateSimPaths(series, dates, lineGenerator, true, width);
            if (this.props.confBounds && this.props.confBounds.length > 0) this.updateConfBounds(this.props.confBounds, areaGenerator, dates);
            // this.updateThresholdIndicators(statThreshold, dateThreshold, xScale, yScale);
        }

        if (this.props.series !== prevProps.series && !this.props.brushActive) {
            // console.log('brushing is FALSE, series diff', this.props.keyVal)
            const { series, dates, width } = this.props;
            const { lineGenerator, areaGenerator } = prevState;
            
            this.updateSimPaths(series, dates, lineGenerator, false, width);
            if (this.props.confBounds && this.props.confBounds.length > 0) this.updateConfBounds(this.props.confBounds, areaGenerator, dates);
            // this.updateThresholdIndicators(statThreshold, dateThreshold, xScale, yScale);
        }

        if (!this.props.brushActive &&
            this.props.stat === prevProps.stat &&
            this.props.severity === prevProps.severity &&
            (this.props.statThreshold !== prevProps.statThreshold || this.props.dateThreshold !== prevProps.dateThreshold)) {
            // console.log('threshold diff', this.props.keyVal)
            const { series, dates, width } = this.props;
            const { lineGenerator, areaGenerator } = prevState;
            
            this.updateSimPaths(series, dates, lineGenerator, false, width);
            if (this.props.confBounds && this.props.confBounds.length > 0) this.updateConfBounds(this.props.confBounds, areaGenerator, dates);
            // this.updateThresholdIndicators(statThreshold, dateThreshold, xScale, yScale);
        }

        if (!this.props.brushActive && (this.props.xScale !== prevProps.xScale || this.props.yScale !== prevProps.yScale)) {
            // console.log('componentDidUpdate scale changed')
            const { series, dates, width } = this.props;
            const { lineGenerator, areaGenerator } = prevState;

            this.updateSimPaths(series, dates, lineGenerator, false, width);
            if (this.props.confBounds && this.props.confBounds.length > 0) this.updateConfBounds(this.props.confBounds, areaGenerator, dates);
        }

    }

    drawSimPaths = (series, dates) => {
        const { lineGenerator } = this.state;
        const { xScale, yScale } = this.props;
        
        // move this lineGenerator update in from calculateSimPaths
        // and use scales passed in from GraphContainer
        lineGenerator.x((d,i) => xScale(dates[i]))
        lineGenerator.y(d => yScale(d))
        // generate simPaths from lineGenerator
        const simPaths = series.map( (d) => {
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
            const simPaths = series.map( (d) => {
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

    drawConfBounds = (confBounds, areaGenerator, dates) => {
        // update areaGenerator from scale and data
        areaGenerator
        .x((d,i) => this.props.xScale(dates[i]))
        .y0(d => this.props.yScale(d.p10)) // this gets the p10 values
        .y1(d => this.props.yScale(d.p90)) // this gets the p90 values

        // generate areaPath for confBounds from areaGenerator
        const confBoundsAreaPath = areaGenerator(confBounds)

        // generate mean line path for confBounds from a confBoundsLineGenerator
        const confBoundsLineGenerator = line()
            .x((d,i) => this.props.xScale(dates[i]))
            .y(d => this.props.yScale(d.p50))
        const confBoundsMeanLinePath = confBoundsLineGenerator(confBounds)

        // save new values to state (possibly duplicate from simPaths update)
        this.setState({
            dates,
            xScale: this.props.xScale,
            yScale: this.props.yScale,
            areaGenerator,
            confBoundsAreaPath,
            confBoundsMeanLinePath
        })
    }

    updateConfBounds = (confBounds, areaGenerator, dates) => {  
        
        if (this.confBoundsRef.current) {
            // update areaGenerator from scale and data
            areaGenerator
            .x((d,i) => this.props.xScale(dates[i]))
            .y0(d => this.props.yScale(d.p10)) // this gets the p10 values
            .y1(d => this.props.yScale(d.p90)) // this gets the p90 values

            // generate areaPath for confBounds from areaGenerator
            const confBoundsAreaPath = areaGenerator(confBounds)

            // generate mean line path for confBounds from a confBoundsLineGenerator
            const confBoundsLineGenerator = line()
                .x((d,i) => this.props.xScale(dates[i]))
                .y(d => this.props.yScale(d.p50))
            const confBoundsMeanLinePath = confBoundsLineGenerator(confBounds)

            // update paths with new data
            const confBoundsNode = select(this.confBoundsRef.current)
            confBoundsNode.selectAll('.confBoundsArea')
                .attr("d", confBoundsAreaPath)
            confBoundsNode.selectAll('.confBoundsMean')
                .attr("d", confBoundsMeanLinePath)

            // save new values to state (possibly duplicate from simPaths update)
            this.setState({
                dates,
                xScale: this.props.xScale,
                yScale: this.props.yScale,
                areaGenerator,
                confBoundsAreaPath,
                confBoundsMeanLinePath
            })
        }
    }

    handleMouseMove = (event, index) => {
        this.setState({ hoveredSimPathId: index })
    }

    handleMouseEnter = (event, index) => {
        this.setState({ hoveredSimPathId: index })
    }

    handleMouseLeave = () => {
        this.setState({ hoveredSimPathId: null })
    }

    handleBetterSimMouseHover = (event) => {
        // console.log('mousemove');
        event.preventDefault();
        const selector = `.graphSVG_${this.props.keyVal}`
        const node = document.querySelector(selector)
        let point = node.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        // console.log(point)
        const xm = this.state.xScale.invert(point.x);
        const ym = this.state.yScale.invert(point.y);
        // console.log(xm, ym);
        const i1 = bisectLeft(this.state.dates, xm, 1);
        const i0 = i1 - 1;
        const i = xm - this.state.dates[i0] > this.state.dates[i1] - xm ? i1 : i0;
        const s = least(this.state.series, d => Math.abs(d.vals[i] - ym));
        // console.log(s)
        const hoveredIdx = this.state.series.findIndex( sim => sim.name === s.name)
        // console.log(hoveredIdx)
        this.setState({ hoveredSimPathId: hoveredIdx })  
    }

    render() {

        return (
            // <div className="graph-area">
                <g 
                    width={this.props.width} 
                    height={this.props.height}
                    transform={`translate(${this.props.x}, ${this.props.y})`}
                    ref={this.simPathsRef}
                >
                    <g> 
                        { // debug graph red outline
                        /* <rect
                            x={0}
                            y={0}
                            width={this.props.width}
                            height={this.props.height}
                            fillOpacity={0}
                            stroke={'#ff0000'}
                            strokeWidth='2'
                        /> */}
                        <rect 
                            x={margin.left}
                            y={margin.top}
                            className={`graphArea`}
                            id={`graphArea_${this.props.keyVal}`}
                            width={this.props.width - margin.left - margin.right}
                            height={this.props.height - margin.bottom - margin.top}
                            fill={'#f6f5f5'}
                            // onMouseEnter={() => console.log('entered')}
                            onMouseMove={(e) => this.handleBetterSimMouseHover(e)}
                            onMouseLeave={(e, i) => this.handleMouseLeave(e, i)}
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
                                strokeOpacity={ this.state.hoveredSimPathId || (this.props.showConfBounds && this.props.confBounds) ? 0 : 0.6}
                                onMouseMove={(e) => this.handleMouseMove(e, i)}
                                onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                            />
                        })}
                        {// highlight simPaths
                        this.state.simPaths.map( (simPath, i) => {
                            // console.log(i)
                            const simIsHovered = (i === this.state.hoveredSimPathId)
                            return <path
                                d={simPath}
                                key={`simPath-${i}-hover`}
                                id={`simPath-${i}-hover`}
                                className={`simPath-hover`}
                                fill='none' 
                                stroke={simIsHovered ? blue : lightgray}
                                strokeWidth={simIsHovered ? '2' : '1'}
                                strokeOpacity={this.state.hoveredSimPathId || (this.props.showConfBounds && this.props.confBounds) ? 1 : 0}
                                onMouseMove={(e) => this.handleMouseMove(e, i)}
                                onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                            />
                        })}
                        {(this.props.showConfBounds && this.props.confBounds) &&
                        <g ref={this.confBoundsRef}>
                            <path
                                className={'confBoundsArea'}
                                d={this.state.confBoundsAreaPath}
                                fill={green}
                                fillOpacity={0.3}
                            ></path>
                            <path
                                className={'confBoundsMean'}
                                d={this.state.confBoundsMeanLinePath}
                                stroke={green}
                                strokeWidth={2}
                                fillOpacity={0}
                            ></path>
                        </g>
                         }
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
                            width={this.props.width}
                            height={this.props.height}
                            orientation={'bottom'}
                            scale={this.props.xScale}
                            x={0}
                            y={this.props.height - margin.bottom}
                        />
                    </g>
                </g>
            // </div>
        )
    }
}

export default Graph