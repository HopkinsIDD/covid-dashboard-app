import React, { Component } from 'react'
import { Tooltip } from 'antd'
import Axis from './Axis'
import Legend from './Legend'
import { line, area, curveLinear } from 'd3-shape'
import { bisectLeft, least, max, maxIndex } from 'd3-array'
import { select } from 'd3-selection'
import { easeCubicOut } from 'd3-ease'
import { margin } from '../../utils/constants'
import colors from '../../utils/colors';

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
            confBoundsMeanLinePath: [],
            tooltipXPos: 0,
            tooltipYPos: 0
        };
        
        this.simPathsRef = React.createRef();
        this.thresholdRef = React.createRef();
        this.confBoundsRef = React.createRef();
        this.actualRef = React.createRef();
    }
    
    componentDidMount() {
        // console.log('ComponentDidMount', this.props.keyVal)
        this.drawSimPaths(this.state.series, this.state.dates);
        if (this.state.confBounds && this.state.confBounds.length > 0) this.drawConfBounds(this.state.confBounds, this.state.areaGenerator, this.state.dates);
        // if (this.props.showActual && this.props.actual) this.drawActualData(actual)
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('ComponentDidUpdate', this.props.keyVal)
        // confidence bounds overlay
        if (this.props.showConfBounds !== prevProps.showConfBounds && this.props.confBounds) {
            // console.log('showConfBounds is', this.props.showConfBounds)
            if (this.props.confBounds) {
                const { confBounds, dates} = this.props;
                const { areaGenerator } = prevState;
                this.updateConfBounds(confBounds, areaGenerator, dates)
            }
        }

        if (this.props.series !== prevProps.series) {
            // console.log('componentDidUpdate SERIES change');
            const { series, dates, animateTransition, width } = this.props;
            const { lineGenerator, areaGenerator } = prevState;
            // console.log('animateTransition', animateTransition)
            console.log(this.props.series)
            this.updateSimPaths(series, dates, lineGenerator, animateTransition, width);
            if (this.props.confBounds && this.props.confBounds.length > 0) this.updateConfBounds(this.props.confBounds, areaGenerator, dates);
        }

        if (this.props.xScale !== prevProps.xScale || this.props.yScale !== prevProps.yScale) {
            // console.log('componentDidUpdate scale changed')
            const { series, dates, animateTransition, width } = this.props;
            const { lineGenerator, areaGenerator } = prevState;

            this.updateSimPaths(series, dates, lineGenerator, animateTransition, width);
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

    updateSimPaths = (series, dates, lineGenerator, animateTransition, width) => {
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

            // this.setState({ 
            //     series: series,
            //     dates: dates,
            //     // xScale: this.props.xScale,
            //     // yScale: this.props.yScale,
            //     lineGenerator: lineGenerator,
            //     simPaths: simPaths,
            //     width
            // })
          
            // get svg node
            const simPathsNode = select(this.simPathsRef.current)

            if (!animateTransition) {
                simPathsNode.selectAll('.simPath')
                    .data(series)
                    .attr("d", d => lineGenerator(d.vals))
                    .attr("stroke", (d,i) => series[i].over ? colors.red : colors.green )
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
                    .duration(100)
                    .ease(easeCubicOut)
                        .attr('stroke-opacity', 0)
                    .transition()
                    .duration(10)
                        .attr("d", d => lineGenerator(d.vals))
                    .transition()
                    .duration(700)
                    .ease(easeCubicOut)
                        .attr("stroke", (d,i) => series[i].over ? colors.red : colors.green )
                        .attr("stroke-opacity", 0.6)
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
        if (this.props.showConfBounds) return
        this.setState({ hoveredSimPathId: index })
    }

    handleMouseEnter = (event, index) => {
        if (this.props.showConfBounds) return
        this.setState({ hoveredSimPathId: index })
    }

    handleMouseLeave = () => {
        this.setState({ hoveredSimPathId: null })
    }

    handleBetterSimMouseHover = (event) => {
        if (this.props.showConfBounds) return
        // console.log('mousemove');
        event.preventDefault();
        const selector = `.graphSVG_${this.props.keyVal}`
        const node = document.querySelector(selector)
        let point = node.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        // console.log(point)
        const xm = this.props.xScale.invert(point.x);
        const ym = this.props.yScale.invert(point.y);
        // console.log(xm, ym);
        const i1 = bisectLeft(this.props.dates, xm, 1);
        const i0 = i1 - 1;
        const i = xm - this.props.dates[i0] > this.props.dates[i1] - xm ? i1 : i0;
        const s = least(this.props.series, d => Math.abs(d.vals[i] - ym));
        // console.log(s)
        if (s) {
            const hoveredIdx = this.props.series.findIndex( sim => sim.name === s.name)
            // console.log(hoveredIdx)
            // we also want to find highest point of sim
            const peak = max(s.vals)
            const peakIndex = maxIndex(s.vals)
            const tooltipXPos = this.props.xScale(this.props.dates[peakIndex])
            const tooltipYPos = this.props.yScale(peak)
            // console.log(peakIndex, peak, tooltipXPos, tooltipYPos)
            this.setState({ hoveredSimPathId: hoveredIdx, tooltipText: `R0: ${s.r0}`, tooltipXPos, tooltipYPos })
        } 
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
                            fill={colors.graphBkgd}
                            // onMouseEnter={() => console.log('entered')}
                            onMouseMove={(e) => this.handleBetterSimMouseHover(e)}
                            onMouseLeave={(e, i) => this.handleMouseLeave(e, i)}
                        />
                        {
                        // visible simPaths
                        this.state.simPaths.map( (simPath, i) => {
                            /* const simIsHovered = (i === this.state.hoveredSimPathId) */
                            return (
                                <path
                                    d={simPath}
                                    key={`simPath-${i}`}
                                    id={`simPath-${i}`}
                                    className={`simPath`}
                                    fill='none' 
                                    stroke = { this.state.series[i].over ? colors.red : colors.green}
                                    strokeWidth={'1'}
                                    strokeOpacity={ this.state.hoveredSimPathId || (this.props.showConfBounds && this.props.confBounds) ? 0 : 0.6}
                                    onMouseMove={(e) => this.handleMouseMove(e, i)}
                                    onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                    onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                                />
                            ) 
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
                                stroke={simIsHovered ? colors.blue : colors.lightGray}
                                strokeWidth={simIsHovered ? '2' : '1'}
                                strokeOpacity={this.state.hoveredSimPathId || (this.props.showConfBounds && this.props.confBounds) ? 1 : 0}
                                onMouseMove={(e) => this.handleMouseMove(e, i)}
                                onMouseEnter={(e) => this.handleMouseEnter(e, i)}
                                onMouseLeave={(e) => this.handleMouseLeave(e, i)}
                            />
                        })}
                        <Tooltip
                            key={`sim-tooltip`}
                            title={this.state.tooltipText}
                            visible={this.state.hoveredSimPathId ? true : false}
                            // visible={true}
                            // align={{
                            //     points: ['bc', 'tc'],        // align top left point of sourceNode with top right point of targetNode
                            //     offset: [10, 20],            // the offset sourceNode by 10px in x and 20px in y,
                            //     targetOffset: ['0%','0%'], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
                            //     overflow: { adjustX: true, adjustY: true }, // auto adjust position when sourceNode is overflowed
                            //   }}
                            data-html="true"
                        >
                            <circle
                                cx={this.state.tooltipXPos}
                                cy={this.state.tooltipYPos}
                                r={2}
                                fill={colors.gray}
                                fillOpacity={0}
                                className={'tooltipCircle'}
                            ></circle>
                        </Tooltip>
                    </g>
                    {(this.props.showConfBounds && this.props.confBounds) &&
                    <g ref={this.confBoundsRef}>
                        <path
                            className={'confBoundsArea'}
                            d={this.state.confBoundsAreaPath}
                            fill={colors.green}
                            fillOpacity={0.3}
                        ></path>
                        <path
                            className={'confBoundsMean'}
                            d={this.state.confBoundsMeanLinePath}
                            stroke={colors.green}
                            strokeWidth={2}
                            fillOpacity={0}
                        ></path>
                    </g>
                        }
                        {(this.props.showActual && this.props.actual) &&
                    <g ref={this.actualRef}>
                        <clipPath 
                            id={'actualClip'}
                        >
                            <rect 
                                x={margin.left}
                                y={margin.top}
                                width={this.props.width - margin.left - margin.right}
                                height={this.props.height - margin.bottom - margin.top}
                                fill={'pink'}
                                fillOpacity={0.5}
                            ></rect>
                        </clipPath>
                        {this.props.actual.map( (d, i) => {
                            return ( 
                                <circle
                                    key={`actual-data-${i}`}
                                    cx={this.props.xScale(d.date)}
                                    cy={this.props.yScale(d.val)}
                                    r={1.5}
                                    fill={colors.actual}
                                    clipPath={'url(#actualClip)'}
                                    className={'actualDataCircle'}
                                >
                                </circle>
                            )
                        })}
                    </g>
                    }
                    <g ref={this.thresholdRef}>
                        <line
                            x1={margin.left}
                            y1={this.props.yScale(this.props.statThreshold) < margin.top ? margin.top : this.props.yScale(this.props.statThreshold)}
                            x2={this.props.width - margin.right}
                            y2={this.props.yScale(this.props.statThreshold) < margin.top ? margin.top : this.props.yScale(this.props.statThreshold)}
                            stroke={colors.gray}
                            className={'statThreshold'}
                            strokeDasharray="4 2"
                        ></line>
                        <line
                            x1={this.props.xScale(this.props.dateThreshold) < margin.left ? margin.left : this.props.xScale(this.props.dateThreshold)}
                            y1={margin.top}
                            x2={this.props.xScale(this.props.dateThreshold) < margin.left ? margin.left : this.props.xScale(this.props.dateThreshold)}
                            y2={this.props.height - margin.bottom}
                            stroke={colors.gray}
                            className={'dateThreshold'}
                            strokeDasharray="4 2"
                        ></line>
                        <circle
                            cx={this.props.xScale(this.props.dateThreshold)}
                            cy={this.props.yScale(this.props.statThreshold)}
                            r={4}
                            fill={colors.gray}
                            className={'thresholdCircle'}
                        ></circle>
                    </g>
                    {
                        this.props.showLegend &&
                        <Legend 
                            showConfBounds={this.props.showConfBounds}
                            showHoveredSim={this.state.hoveredSimPathId}
                            showActual={this.props.showActual}
                            x={this.props.width - margin.right - 160}
                            y={margin.top * 2.3}
                        />
                    }
                    <g>
                        <Axis 
                            keyVal={this.props.keyVal}
                            width={this.props.width}
                            height={this.props.height}
                            orientation={'bottom'}
                            view={'graph'}
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