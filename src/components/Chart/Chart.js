import React, { Component, Fragment } from 'react'; 
import { min, max, quantile } from 'd3-array';
import { scaleLinear, scaleBand, scaleLog, scalePow } from 'd3-scale';
import { select } from 'd3-selection';
import { easeCubicOut } from 'd3-ease'
import { timeFormat } from 'd3-time-format';
import Axis from '../Graph/Axis';
import { getDateIdx, addCommas } from '../../utils/utils';
import { margin, chartBkgd, green, gray, blue, scenarioColors } from '../../utils/constants'

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
            // tooltipText: '',
            severityMap: {
                'high': '1% IFR, 10% hospitalization rate',
                'med': '0.5% IFR, 5% hospitalization rate',
                'low': '0.25% IFR, 2.5% hospitalization rate'
            }
            // quantileObj: {}
        }
        this.tooltipRef = React.createRef();
        this.chartRef = React.createRef();
    }
    componentDidMount() {
        // console.log('componentDidMount');
        const calc = this.calculateQuantiles();
        this.setState({ quantileObj: calc.quantileObj, xScale: calc.xScale, yScale: calc.yScale, scaleDomains: calc.scaleDomains })
        
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(this.props.summaryStart, this.props.summaryEnd)
        // console.log('componentDidUpdate')
        // console.log(prevProps)
        // console.log(this.props)
        if (prevProps.summaryStart !== this.props.summaryStart || 
            prevProps.summaryEnd !== this.props.summaryEnd ||
            prevProps.dataset !== this.props.dataset ||
            prevProps.scenarios !== this.props.scenarios ||
            prevProps.stats !== this.props.stats ||
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height) {
                console.log('componentDidUpdate main check')
                const calc = this.calculateQuantiles();
                this.setState({ quantileObj: calc.quantileObj, xScale: calc.xScale, yScale: calc.yScale, scaleDomains: calc.scaleDomains })
        }
        if (prevProps.scale !== this.props.scale) {
            console.log('componentDidUpdate scale check')
            const calc = this.calculateQuantiles();
            this.setState({ quantileObj: calc.quantileObj, xScale: calc.xScale, yScale: calc.yScale, scaleDomains: calc.scaleDomains })
            // this.updateSummaryStats(calc.quantileObj, calc.xScale, calc.yScale, calc.scaleDomains);
        }
    }

    calculateQuantiles = () => {
        const { dataset, firstDate, summaryStart, summaryEnd, stat, width, height, scenarios } = this.props;
        const { severities } = this.state;
        const quantileObj = {}
        
        const startIdx = getDateIdx(firstDate, summaryStart);
        const endIdx = getDateIdx(firstDate, summaryEnd);
        // console.log(startIdx, endIdx);
        let globalMaxVal = 0;
        // console.log(scenarios)
        // console.log(stat)
        quantileObj[stat] = {};
        for (let severity of severities) {
            // console.log(severity)
            quantileObj[stat][severity] = {};
            for (let scenario of scenarios) {
                // console.log(scenario)
                // every Chart has a given stat passed down from ChartContainer
                // every Chart will contain all scenarios and all severities
                // startIdx and endIdx specify the time range on which we want to calc quantiles
                // every sim.vals array will be sliced on this timeRange 
                // then every day of a simulation will be summed up returning an Array of sim sums 
                // then d3.quantiles can be applied to the Array to create final desired obj
                
                const sumArray = dataset[scenario][severity][stat].sims.map(sim => {
                    return sim.vals.slice(startIdx, endIdx).reduce((a, b) => a + b, 0)
                } );
                // console.log(scenario, stat, severity, sumArray)
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
        const xScale = scaleBand().range([0, (width / severities.length) - margin.left]).domain(scenarios)//.paddingInner(1).paddingOuter(.5);
        const scaleDomains = true
        return { quantileObj, xScale, yScale, scaleDomains}
        // this.setState({ quantileObj, xScale, yScale, scaleDomains: true })
    }

    updateSummaryStats = (quantileObj, xScale, yScale, scaleDomains) => {
        console.log('updateSummaryStats')
        if (this.chartRef.current) {
            console.log('ref check, update Summary stats')
            const barWidth = ((this.props.width / this.state.severities.length) / this.props.scenarios.length) - margin.left - margin.right;
            // console.log('barWidth', barWidth)
            const whiskerMargin = barWidth * 0.2;
            // console.log('whiskerMargin', whiskerMargin)
            const rectWidth = (this.props.width / this.state.severities.length) - margin.left

            // update paths with new data
            const barNodes = select(this.chartRef.current)
            this.props.severities.map( (severity, i) => {
                Object.entries(quantileObj[this.props.stat][severity]).map( ([key, value], j) => {
                    barNodes.selectAll('.bars')
                        .transition()
                        .duration(500)
                        .attr("x", (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + xScale(key))
                        .attr("y", yScale(value.median))
                        .attr("width", barWidth)
                        .attr("height", yScale(0) - yScale(value.median))
                        .ease(easeCubicOut)
                    .on("end", () => {
                        console.log('bar rect transition ended')
                        this.setState({ quantileObj, xScale, yScale, scaleDomains })
                    })
                })
            })
        }
    }

    handleHighlightEnter = (event, severity, key, index) => {
        if (!this.state.rectIsHovered) {
            console.log('handleHighlightEnter', this.state.rectIsHovered)
            event.stopPropagation();
            // console.log(severity, key, index)
            const hoveredRect = {
                'severity': severity,
                'scenario': key,
                'index': index
            }
            const { severities, quantileObj }  = this.state;
            const { stat, statLabel, summaryStart, summaryEnd, width } = this.props;
            // const formatDate = timeFormat('%b %d, %Y'); //timeFormat('%Y-%m-%d')
            const median = quantileObj[stat][severity][key]['median']
            const tenth = quantileObj[stat][severity][key]['tenth']
            const ninetyith = quantileObj[stat][severity][key]['ninetyith']
            // console.log(quantileObj[stat][severity][key])

            const tooltipText = `<b>50%</b> chance of <b>${addCommas(Math.ceil(median))}</b> ${statLabel}<br><br> ` +
                                // `from <b>${formatDate(summaryStart)}</b> to <b>${formatDate(summaryEnd)}</b> <br><br>` +
                                `<b>90%</b> chance of <b>${addCommas(Math.ceil(tenth))} to ${addCommas(Math.ceil(ninetyith))}</b> ${statLabel} `
                                // `from <b>${formatDate(summaryStart)}</b> to <b>${formatDate(summaryEnd)}</b>`
            // console.log(tooltipText)
            const tooltip = this.tooltipRef.current;
            tooltip.innerHTML = tooltipText
            // (i * (width / severities.length) - margin.left - margin.right) + this.state.xScale(key)
            if (severity === 'high') {
                tooltip.style.marginLeft = `${(1 * (width  - margin.left - margin.right) / severities.length) + this.state.xScale(key) - 300}px`
            } else if (severity === 'med') {
                tooltip.style.marginLeft = `${(2 * (width  - margin.left - margin.right) / severities.length) + this.state.xScale(key) - 300}px`
            } else {
                tooltip.style.marginLeft = `${(3 * (width  - margin.left - margin.right) / severities.length) + this.state.xScale(key) - 300}px`
            }
            this.setState({ hoveredRect, rectIsHovered: true })
            this.props.handleCalloutInfo( statLabel, median, tenth, ninetyith, true );
            this.props.handleScenarioHover( index );
        }
    }

    handleHighlightLeave = () => {
        const hoveredRect = {
            'severity': '',
            'scenario': '',
            'index': 0
        }
        this.setState({ hoveredRect, rectIsHovered: false })
        this.props.handleCalloutLeave();
        this.props.handleScenarioHover( null );
    }

    drawSummaryStats = () => {
        const barWidth = ((this.props.width / this.state.severities.length) / this.props.scenarios.length) - margin.left - margin.right;
        // console.log('barWidth', barWidth)
        const whiskerMargin = barWidth * 0.2;
        // console.log('whiskerMargin', whiskerMargin)
        const rectWidth = (this.props.width / this.state.severities.length) - margin.left
        // console.log('rectWidth', rectWidth)
        return (
            this.state.severities.map( (severity, i) => {
            return (
                <Fragment key={`chart-fragment-${severity}`}>
                <rect
                    key={`chart-rect-${severity}`}
                    width={(this.props.width / this.state.severities.length) - margin.left}
                    height={this.props.height - margin.chartTop - margin.bottom + 2}
                    x={margin.left + (i * (this.props.width / this.state.severities.length))}
                    y={margin.chartTop}
                    fill={chartBkgd}
                >
                </rect>
                <text
                    key={`bar-label-${severity}`}
                    x={(i * (this.props.width / this.state.severities.length)) + (this.props.width / this.state.severities.length * 0.5)}
                    y={margin.top}
                    textAnchor={'middle'}
                    opacity={0.65}
                    // className='titleNarrow'
                    style={{'fontSize': '0.8rem'}}
                >
                    {this.state.severityMap[severity]}
                </text>
                <g key={`chart-group-${severity}`}>
                    { Object.entries(this.state.quantileObj[this.props.stat][severity]).map( ([key, value], j) => {
                        // console.log(severity, 'barPos', key, this.state.xScale(key))
                    return (
                        <Fragment key={`chart-fragment-${severity}-${key}`}>
                            <rect 
                                d={value}
                                key={`bar-${severity}-${key}`}
                                className={'bars'}
                                width={barWidth}
                                height={this.state.yScale(0) - this.state.yScale(value.median)}
                                x={(margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key)}
                                y={this.state.yScale(value.median)}
                                fill={scenarioColors[j]}
                                stroke={this.state.hoveredRect.severity === severity &&
                                    this.state.hoveredRect.scenario === key ? blue: scenarioColors[j]}
                                strokeWidth={4}
                                style={{ cursor: 'pointer'}}
                                onMouseEnter={(e) => this.handleHighlightEnter(e, severity, key, j)}
                                onMouseLeave={this.handleHighlightLeave}
                            >
                            </rect>
                            <line
                                key={`vertline-${severity}-${key}`}
                                x1={(barWidth/2 + (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key))}
                                y1={this.state.yScale(value.ninetyith)}
                                x2={(barWidth/2 + (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key))}
                                y2={this.state.yScale(value.tenth)}
                                stroke={gray}
                                strokeWidth={1}
                            >
                            </line>
                            <line
                                key={`topline-${severity}-${key}`}
                                x1={(whiskerMargin + (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key))}
                                y1={this.state.yScale(value.ninetyith)}
                                x2={(barWidth - whiskerMargin + (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key))}
                                y2={this.state.yScale(value.ninetyith)}
                                stroke={gray}
                                strokeWidth={1}
                            >
                            </line>
                            <line
                                key={`bottomline-${severity}-${key}`}
                                x1={(whiskerMargin + (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key))}
                                y1={this.state.yScale(value.tenth)}
                                x2={(barWidth - whiskerMargin + (margin.left * 2) + (i * (this.props.width / this.state.severities.length)) + this.state.xScale(key))}
                                y2={this.state.yScale(value.tenth)}
                                stroke={gray}
                                strokeWidth={1}
                            >
                            </line>
                        </Fragment>
                    )
                })
                }
                </g>
                </Fragment>
            )
        }))
    }

    updateSummaryStats = () => {
        if(this.chartRef.current) {
            const chartNode = select(this.chartRef.current);
        }
    }

    render() {
        // console.log(this.props.width, this.props.height)
        return (
            <div >
                <div className="y-axis-label chart-yLabel titleNarrow">
                  {this.props.statLabel}
                  </div>
                  <div className="tooltip">
                    <span className="tooltip-text" ref={this.tooltipRef} style={this.state.rectIsHovered ? { visibility: 'hidden', width: '135px', position: 'absolute', padding: '10px', zIndex: 10 } : { visibility: 'hidden' }}></span>
                  </div>
                  {this.state.scaleDomains &&
                    <Fragment>
                        <svg 
                            width={margin.yAxis}
                            height={this.props.height} 
                        >
                        <Axis 
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
                        </svg>
                    </Fragment>
                  }
            </div>
        )
    }
}

export default Chart 