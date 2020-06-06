import React, { Component, Fragment } from 'react'; 
import { min, max, quantile } from 'd3-array';
import { scaleLinear, scaleBand, scalePow } from 'd3-scale';
import { select } from 'd3-selection';
import { easeCubicOut } from 'd3-ease'
import _ from 'lodash';
import { Tooltip } from 'antd';
import Axis from '../Graph/Axis';
import { getDateIdx, addCommas, capitalize } from '../../utils/utils';
import { margin, chartBkgd, gray, blue, scenarioColors } from '../../utils/constants'

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            severities: ['high', 'med', 'low'],
            scaleDomains: false,
            hoveredRect: {
                'severity': '',
                'scenario': '',
                'index': 0
            },
            rectIsHovered: false,
        }
        this.tooltipRef = React.createRef();
        this.chartRef = React.createRef();
        this.chartYAxisRef = React.createRef();
    }
    componentDidMount() {
        // console.log('Chart componentDidMount');
        const calc = this.calculateQuantiles();
        this.setState({ quantileObj: calc.quantileObj, xScale: calc.xScale, yScale: calc.yScale, scaleDomains: calc.scaleDomains })
        
    }

    componentDidUpdate(prevProps) {

        if (prevProps.start !== this.props.start || 
            prevProps.end !== this.props.end ||
            prevProps.dataset !== this.props.dataset ||
            prevProps.stats !== this.props.stats ||
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height) {
            // console.log('Chart componentDidUpdate', this.props)

            const calc = this.calculateQuantiles();
            this.setState({ quantileObj: calc.quantileObj, xScale: calc.xScale, yScale: calc.yScale, scaleDomains: calc.scaleDomains })
        }
        if (prevProps.scenarios !== this.props.scenarios ||
            prevProps.scale !== this.props.scale) {
            // console.log('componentDidUpdate scale check')
            const calc = this.calculateQuantiles();
            // this.setState({ quantileObj: calc.quantileObj, xScale: calc.xScale, yScale: calc.yScale, scaleDomains: calc.scaleDomains })
            this.updateSummaryStats(calc.quantileObj, calc.xScale, calc.yScale, calc.scaleDomains);
        }
    }

    calculateQuantiles = () => {
        const { dataset, firstDate, start, end, stat, width, height, scenarios } = this.props;
        const { severities } = this.state;
        let quantileObj = {[stat]: {}};
        
        const startIdx = getDateIdx(firstDate, start);
        const endIdx = getDateIdx(firstDate, end);
        // console.log(startIdx, endIdx);
        let globalMaxVal = 0;
        // console.log('Chart scenarios', scenarios)
        // console.log('Chart dataset', dataset)
        // console.log(stat)
        for (let severity of severities) {
            // console.log(severity)
            quantileObj[stat][severity] = {};
            for (let scenario of scenarios) {
                // catch in case scenarios hasn't updated yet
                // if (!(scenario in dataset)) { return }

                const sumArray = dataset[scenario][severity][stat].sims.map(sim => {
                    return sim.vals.slice(startIdx, endIdx).reduce((a, b) => a + b, 0)
                } );
                const minVal = min(sumArray)
                const maxVal = max(sumArray)
                const tenth = quantile(sumArray, 0.10)
                const quartile = quantile(sumArray, 0.25)
                const median = quantile(sumArray, 0.5)
                const thirdquartile = quantile(sumArray, 0.75)
                const ninetyith = quantile(sumArray, 0.9)
                
                // keep track of largest value across all the severities and scenarios for yAxis
                if (maxVal > globalMaxVal) globalMaxVal = maxVal

                quantileObj[stat][severity][scenario] = {
                    minVal, maxVal, tenth, quartile, median, thirdquartile, ninetyith, //xScale, yScale
                }
            }
        }
        
        // console.log(quantileObj)
        let yScale;
        if (this.props.scale === 'linear') {
            yScale = scaleLinear().range([height - margin.bottom, margin.top]).domain([0, globalMaxVal])
        } else {
           yScale = scalePow().exponent(0.25).range([height - margin.bottom, margin.chartTop]).domain([0, globalMaxVal])
        }
        // const yScale = scaleLog().range([height - margin.bottom, margin.top]).domain([1, globalMaxVal]) //
        const xScale = scaleBand().range([margin.left, width]).domain(scenarios)//.paddingInner(1).paddingOuter(.5);
        const scaleDomains = true
        return { quantileObj, xScale, yScale, scaleDomains}
        // this.setState({ quantileObj, xScale, yScale, scaleDomains: true })
    }

    updateSummaryStats = (quantileObj, xScale, yScale, scaleDomains) => {
        // console.log('updateSummaryStats')
        if (this.chartRef.current) {
            // console.log('ref check, update Summary stats')
            const barWidth = ((this.props.width / this.state.severities.length) / this.props.scenarios.length) - margin.left - margin.right;
            const barMargin = 10;
            const whiskerMargin = barWidth * 0.2;
            // update paths with new data
            const barNodes = select(this.chartRef.current)
            // console.log(this.chartYAxisRef.current)
            // this.chartYAxisRef.props.scale = yScale
            // this.chartYAxisRef.updateAxis()

            this.state.severities.map( (severity, i) => {
                Object.entries(quantileObj[this.props.stat][severity]).forEach( ([key, value]) => {
                    barNodes.selectAll(`.bar-${severity}-${key}`)
                        .transition()
                        .duration(500)
                        .attr("x", (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key))
                        .attr("y", yScale(value.median))
                        .attr("width", barWidth)
                        .attr("height", yScale(0) - yScale(value.median))
                        .ease(easeCubicOut)
                    .on("end", () => {
                        // console.log('bar rect transition ended')
                        // this.setState({ quantileObj, xScale, yScale, scaleDomains })
                    })
                    barNodes.selectAll(`.vertline-${severity}-${key}`)
                        .transition()
                        .duration(500)
                        .attr("x1", (barWidth/2 + (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key)))
                        .attr("y1", yScale(value.ninetyith))
                        .attr("x2", (barWidth/2 + (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key)))
                        .attr("y2", yScale(value.tenth))
                        .ease(easeCubicOut)
                    .on("end", () => {
                        // console.log('vertical line transition ended')
                        // this.setState({ quantileObj, xScale, yScale, scaleDomains })
                    })
                    barNodes.selectAll(`.topline-${severity}-${key}`)
                        .transition()
                        .duration(500)
                        .attr("x1", (whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key)))
                        .attr("y1", yScale(value.ninetyith))
                        .attr("x2", (barWidth - whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key)))
                        .attr("y2", yScale(value.ninetyith))
                        .ease(easeCubicOut)
                    .on("end", () => {
                        // console.log('top line transition ended')
                        // this.setState({ quantileObj, xScale, yScale, scaleDomains })
                    })
                    barNodes.selectAll(`.bottomline-${severity}-${key}`)
                        .transition()
                        .duration(500)
                        .attr("x1", (whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key)))
                        .attr("y1", yScale(value.tenth))
                        .attr("x2", (barWidth - whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + xScale(key)))
                        .attr("y2", yScale(value.tenth))
                        .ease(easeCubicOut)
                    .on("end", () => {
                        // console.log('bottom line transition ended')
                        this.setState({ quantileObj, xScale, yScale, scaleDomains })
                    })
                })
            })
        }
    }

    drawSummaryStats = () => {
        const barWidth = ((this.props.width / this.state.severities.length) / this.props.scenarios.length) - margin.left - margin.right;
        const barMargin = 10;
        const whiskerMargin = barWidth * 0.2;
        const rectWidth = this.props.width - margin.left
        return (
            <Fragment key={`chart-fragment`}>
            <rect
                key={`chart-bkgd-rect`}
                width={rectWidth}
                height={this.props.height - margin.chartTop - margin.bottom + 2}
                x={margin.left}
                y={margin.chartTop}
                fill={chartBkgd}
            >
            </rect>
            {this.state.severities.map( (severity, i) => {
            return (
                <g key={`chart-group-${severity}`}>
                    { Object.entries(this.state.quantileObj[this.props.stat][severity]).map( ([key, value], j) => {
                        // console.log(severity, 'barPos', key, this.state.xScale(key))
                        // console.log(this.props.stat, i, j, severity, this.state.yScale(value.median))
                        if (!(this.props.stat === 'incidI' && (severity === 'high' || severity === 'low'))) {
                            return (
                                <Fragment key={`chart-fragment-${severity}-${key}`}>
                                    <rect 
                                        d={value}
                                        key={`bar-${severity}-${key}`}
                                        className={`bar-${severity}-${key}`}
                                        width={barWidth}
                                        height={this.state.yScale(0) - this.state.yScale(value.median)}
                                        x={(margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key)}
                                        y={this.state.yScale(value.median)}
                                        fill={scenarioColors[j]}
                                        stroke={this.state.hoveredRect.severity === severity &&
                                            this.state.hoveredRect.scenario === key ? blue: scenarioColors[j]}
                                        strokeWidth={4}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </rect>
                                    <line
                                        key={`vertline-${severity}-${key}`}
                                        className={`vertline-${severity}-${key}`}
                                        x1={(barWidth/2 + (margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key))}
                                        y1={this.state.yScale(value.ninetyith)}
                                        x2={(barWidth/2 + (margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key))}
                                        y2={this.state.yScale(value.tenth)}
                                        stroke={gray}
                                        strokeWidth={1}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </line>
                                    <line
                                        key={`topline-${severity}-${key}`}
                                        className={`topline-${severity}-${key}`}
                                        x1={(whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key))}
                                        y1={this.state.yScale(value.ninetyith)}
                                        x2={(barWidth - whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key))}
                                        y2={this.state.yScale(value.ninetyith)}
                                        stroke={gray}
                                        strokeWidth={1}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </line>
                                    <line
                                        key={`bottomline-${severity}-${key}`}
                                        className={`bottomline-${severity}-${key}`}
                                        x1={(whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key))}
                                        y1={this.state.yScale(value.tenth)}
                                        x2={(barWidth - whiskerMargin + (margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key))}
                                        y2={this.state.yScale(value.tenth)}
                                        stroke={gray}
                                        strokeWidth={1}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </line>
                                    <Tooltip
                                        key={`tooltip-chart-${i}-${j}`}
                                        title={this.state.tooltipText}
                                        visible={this.state.hoveredRect.severity === severity &&
                                                this.state.hoveredRect.scenario === key ? true : false}
                                        data-html="true"
                                    >
                                        {/* debug red rect highlight */}
                                        <rect
                                            d={value}
                                            key={`bar-${severity}-${key}-hover`}
                                            className={'bars-hover'}
                                            width={barWidth}
                                            // height={this.state.yScale(0) - this.state.yScale(value.median)}
                                            height={this.state.yScale(value.median) / (this.props.height - margin.bottom) > 0.9 ? 20 : this.state.yScale(0) - this.state.yScale(value.median)}
                                            x={(margin.left * 2) + (i * (barWidth + barMargin)) + this.state.xScale(key)}
                                            y={ this.state.yScale(value.median) / (this.props.height - margin.bottom) > 0.9 ? this.props.height - margin.bottom - 20 : this.state.yScale(value.median)}
                                            fill={'red'}
                                            fillOpacity={0}
                                            stroke={'red'}
                                            strokeOpacity={0}
                                            strokeWidth={4}
                                            style={{ cursor: 'pointer'}}
                                            onMouseEnter={(e) => this.handleHighlightEnter(e, severity, key, j)}
                                            onMouseLeave={this.handleHighlightLeave}
                                        >
                                        </rect>
                                    </Tooltip>
                                </Fragment>
                            )
                        }
                    })
                }
                </g>
                )
            })}
            </Fragment>
        )
    }

    handleHighlightEnter = _.debounce((event, severity, key, index) => {
        // console.log('chart highlight enter')
        
        if (!this.state.rectIsHovered) {
            // console.log('rect not hovered')
            // event.stopPropagation();
            // event.preventDefault();
            // console.log(severity, key, index)
            const hoveredRect = {
                'severity': severity,
                'scenario': key,
                'index': index
            }
            const { quantileObj }  = this.state;
            const { stat, statLabel, scenarios } = this.props;
            // console.log(severity, key, index, stat, scenarios, scenarios[index])
            // const formatDate = timeFormat('%b %d, %Y'); //timeFormat('%Y-%m-%d')
            const median = quantileObj[stat][severity][key]['median']
            const tenth = quantileObj[stat][severity][key]['tenth']
            const ninetyith = quantileObj[stat][severity][key]['ninetyith']
            // console.log(median, this.state.yScale(median), this.state.yScale(median) / (this.props.height - margin.bottom))
            // console.log(quantileObj[stat][severity][key])
            const severityText = this.props.stat === 'incidI' ? '' : `${capitalize(severity)} Severity<br>`;
            const text =    `${scenarios[index].replace('_', ' ')}<br>` +
                            severityText +
                            `p90: ${addCommas(Math.ceil(ninetyith))}<br>` +
                            `median: ${addCommas(Math.ceil(median))}<br>` +
                            `p10: ${addCommas(Math.ceil(tenth))}<br>`
    
            const tooltipText = () =>  (<div dangerouslySetInnerHTML={{__html: text}}></div>)

            this.setState({ hoveredRect, rectIsHovered: true, tooltipText })
            this.props.handleCalloutInfo( statLabel, median, tenth, ninetyith, true );
            this.props.handleScenarioHover( index );
        }
    }, 100)

    handleHighlightLeave = _.debounce(() => {
        // console.log('chart highlight leave')
        if (this.state.rectIsHovered) {
            // console.log('rect is hovered')
            const hoveredRect = {
                'severity': '',
                'scenario': '',
                'index': 0
            }
            this.setState({ hoveredRect, rectIsHovered: false })
            this.props.handleCalloutLeave();
            this.props.handleScenarioHover( null );
        }
    }, 100)

    render() {
        // console.log(this.props.width, this.props.height)
        return (
            <div >
                {/* <div className="y-axis-label chart-yLabel titleNarrow">
                  {this.props.statLabel}
                  </div> */}
                  {this.state.scaleDomains &&
                    <Fragment>
                        <svg 
                            width={margin.yAxis}
                            height={this.props.height} 
                        >
                            <text
                                transform="rotate(-90)"
                                y={0}
                                x={0-(this.props.height / 2)}
                                dy="1em"
                                opacity={0.65}
                                textAnchor="middle"
                                style={{ fontSize: '1rem'}}
                                className="titleNarrow"
                            >
                                {this.props.statLabel}
                            </text>
                            <Axis 
                                ref={this.chartYAxisRef}
                                width={this.props.width}
                                height={this.props.height - margin.chartTop - margin.bottom}
                                orientation={'left'}
                                scale={this.state.yScale}
                                x={margin.yAxis}
                                y={0}
                                tickNum={4}
                            />
                        </svg>
                        <svg 
                        width={this.props.width}
                        height={this.props.height}
                        ref={this.chartRef}
                        >
                        {this.drawSummaryStats()}
                        <Axis 
                            ref={this.chartXAxisRef}
                            view={'chart'}
                            width={this.props.width}
                            height={this.props.height}
                            orientation={'bottom'}
                            scale={this.state.xScale}
                            x={0}
                            y={this.props.height - margin.bottom + 1}
                            tickNum={this.props.scenarios.length}
                            axisVisible={false}
                        />
                        </svg>
                    </Fragment>
                  }
            </div>
        )
    }
}

export default Chart 