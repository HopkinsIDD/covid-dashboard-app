import React, { Component, Fragment } from 'react'; 
import { min, max, quantile } from 'd3-array';
import { scaleLinear, scaleBand, scalePow } from 'd3-scale';
import { select } from 'd3-selection';
import { easeCubicOut } from 'd3-ease'
import _ from 'lodash';
import { Tooltip } from 'antd';
import Axis from '../Graph/Axis';
import { getDateIdx, addCommas, capitalize } from '../../utils/utils';
import { margin } from '../../utils/constants'
import colors, { gray, scenarioColorPalette } from '../../utils/colors';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: this should be designated in MainChart and sent as a prop
            // if removed, Chart thinks severities is undefined on render()
            severities: ["high", "med", "low"],
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
        const { dataset } = this.props;
        const calc = this.calculateQuantiles();

        // TODO: assumes all scenarios in "run" has same list of severities
        const firstScenario = Object.keys(dataset)[0];
        const severities = Object.keys(dataset[firstScenario])
            .filter(sev => sev !== 'dates');

        this.setState({ 
            severities,
            quantileObj: calc.quantileObj, 
            xScale: calc.xScale, 
            yScale: calc.yScale, 
            scaleDomains: calc.scaleDomains 
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.start !== this.props.start || 
            prevProps.end !== this.props.end ||
            prevProps.dataset !== this.props.dataset ||
            prevProps.stats !== this.props.stats ||
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height) {

            const calc = this.calculateQuantiles();
            this.setState({ 
                quantileObj: calc.quantileObj, 
                xScale: calc.xScale, 
                yScale: calc.yScale, 
                scaleDomains: calc.scaleDomains 
            });        
        }

        if (prevProps.scenarios !== this.props.scenarios ||
            prevProps.scale !== this.props.scale) {
            const calc = this.calculateQuantiles();
            this.updateSummaryStats(
                calc.quantileObj, calc.xScale, calc.yScale, calc.scaleDomains);
        }
    }

    calculateQuantiles = () => {
        const { dataset, scenarios, scenarioMap } = this.props;
        const { firstDate, start, end, stat, width, height } = this.props;
        let quantileObj = {[stat]: {}};
        
        const startIdx = getDateIdx(firstDate, start);
        const endIdx = getDateIdx(firstDate, end);
        let globalMaxVal = 0;

        // for (let scenario of scenarios) {
        //     const severities = scenarioMap[scenario];
        //     for (let severity of severities) {
        //         quantileObj[stat][severity] = {};

        // TODO: using severities based on first scenario, but what if scenarios
        // have different severity lists? this needs to be refactored to take that 
        // into account
        const severities = scenarioMap[scenarios[0]];

        for (let severity of severities) {
            quantileObj[stat][severity] = {};
            for (let scenario of scenarios) {
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
    }

    updateSummaryStats = (quantileObj, xScale, yScale, scaleDomains) => {
        if (this.chartRef.current) {
            const barWidth = ((this.props.width / this.state.severities.length) / this.props.scenarios.length) - margin.left - margin.right;
            const barMargin = 10;
            const whiskerMargin = barWidth * 0.2;
            // update paths with new data
            const barNodes = select(this.chartRef.current)
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
                fill={colors.chartBkgd}
            >
            </rect>
            {this.state.severities.map( (severity, i) => {
            return (
                <g key={`chart-group-${severity}`}>
                    { Object.entries(this.state.quantileObj[this.props.stat][severity]).map( ([key, value], j) => {
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
                                        fill={scenarioColorPalette[j]}
                                        stroke={this.state.hoveredRect.severity === severity &&
                                            this.state.hoveredRect.scenario === key ? colors.blue: scenarioColorPalette[j]}
                                        strokeWidth={4}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </rect>
                                    <text 
                                        className='tick'
                                        opacity={0.65}
                                        textAnchor='middle'
                                        x={(margin.left * 2) + (i * ((barWidth) + barMargin)) + this.state.xScale(key) - 7 + (i*3.5) + (barWidth * 0.5) }
                                        y={this.props.height - 22}
                                    >{severity}</text>
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
        if (!this.state.rectIsHovered) {
            const hoveredRect = {
                'severity': severity,
                'scenario': key,
                'index': index
            }
            const { quantileObj }  = this.state;
            const { stat, statLabel, scenarios } = this.props;
            const median = quantileObj[stat][severity][key]['median']
            const tenth = quantileObj[stat][severity][key]['tenth']
            const ninetyith = quantileObj[stat][severity][key]['ninetyith']
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
        if (this.state.rectIsHovered) {
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
        return (
            <div >
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
                </Fragment>}
            </div>
        )
    }
}

export default Chart 