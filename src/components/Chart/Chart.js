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
        const calc = this.calculateQuantiles();

        this.setState({ 
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

        for (let scenario of scenarios) {
            const severities = scenarioMap[scenario]
            quantileObj[stat][scenario] = {};
            for (let severity of severities) {
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

                quantileObj[stat][scenario][severity] = {
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
        
        const xScale = scaleBand().range([margin.left, width]).domain(scenarios)//.paddingInner(1).paddingOuter(.5);
        const scaleDomains = true
        return { quantileObj, xScale, yScale, scaleDomains}
    }

    updateSummaryStats = (quantileObj, xScale, yScale, scaleDomains) => {
        if (this.chartRef.current) {
            const { scenarios, width, stat, scenarioMap } = this.props;
            // always calculate barWidth for three severities even if there are fewer
            const barWidth = ((width / 3) / scenarios.length) - margin.left - margin.right;
            const barMargin = 10;
            const whiskerMargin = barWidth * 0.2;
            // update paths with new data
            const barNodes = select(this.chartRef.current)

            scenarios.map( (scenario, i) => {
                const severities = scenarioMap[scenario]
                Object.entries(quantileObj[stat][scenario]).forEach( ([severity, value], j) => {
                    // place scenarios with fewer severities around the center tick mark
                    if (severities.length === 1) {
                        j = 1
                    } else if (severities.length === 2) {
                        j +=  ((j + 1) * 0.3333)
                    } else {
                        // just use j
                    }
                    // severity (key) is the severity, value is the object of quantiles calculated
                    barNodes.selectAll(`.bar-${scenario}-${severity}`)
                        .transition()
                        .duration(500)
                        .attr("x", (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))
                        .attr("y", yScale(value.median))
                        .attr("width", barWidth)
                        .attr("height", yScale(0) - yScale(value.median))
                        .ease(easeCubicOut)
                    
                    barNodes.selectAll(`.vertline-${scenario}-${severity}`)
                        .transition()
                        .duration(500)
                        .attr("x1", (barWidth/2 + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)))
                        .attr("y1", yScale(value.ninetyith))
                        .attr("x2", (barWidth/2 + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)))
                        .attr("y2", yScale(value.tenth))
                        .ease(easeCubicOut)
             
                    barNodes.selectAll(`.topline-${scenario}-${severity}`)
                        .transition()
                        .duration(500)
                        .attr("x1", (whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)))
                        .attr("y1", yScale(value.ninetyith))
                        .attr("x2", (barWidth - whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)))
                        .attr("y2", yScale(value.ninetyith))
                        .ease(easeCubicOut)
                    
                    barNodes.selectAll(`.bottomline-${scenario}-${severity}`)
                        .transition()
                        .duration(500)
                        .attr("x1", (whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)))
                        .attr("y1", yScale(value.tenth))
                        .attr("x2", (barWidth - whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)))
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
        const { width, height, scenarios, stat, scenarioMap } = this.props;
        const { quantileObj, yScale, xScale, hoveredRect, tooltipText } = this.state;
        // always calculate barWidth for three severities even if there are fewer
        const barWidth = ((width / 3) / scenarios.length) - margin.left - margin.right;
        const barMargin = 10;
        const whiskerMargin = barWidth * 0.2;
        const rectWidth = width - margin.left
        return (
            <Fragment key={`chart-fragment`}>
            <rect
                key={`chart-bkgd-rect`}
                width={rectWidth}
                height={height - margin.chartTop - margin.bottom + 2}
                x={margin.left}
                y={margin.chartTop}
                fill={colors.chartBkgd}
            >
            </rect>
            {scenarios.map( (scenario, i) => {
                const severities = scenarioMap[scenario]
                return (
                    quantileObj[stat][scenario] && 
                    <g key={`chart-group-${scenario}`}>
                    { Object.entries(quantileObj[stat][scenario]).map( ([severity, value], j) => {
                        // place scenarios with fewer severities around the center tick mark
                        if (severities.length === 1) {
                            j = 1
                        } else if (severities.length === 2) {
                            j +=  ((j + 1) * 0.3333)
                        } else {
                            // just use j
                        }
                        // case for Infections (incidI) having the same results for low, med and high severities
                        // solution: only display med severity
                        // severity (key) is the severity, value is the object of quantiles calculated
                        if (!(stat === 'incidI' && (severity === 'high' || severity === 'low'))) {
                            return (
                                <Fragment key={`chart-fragment-${scenario}-${severity}`}>
                                    <rect 
                                        d={value}
                                        key={`bar-${scenario}-${severity}`}
                                        className={`bar-${scenario}-${severity}`}
                                        width={barWidth}
                                        height={yScale(0) - yScale(value.median)}
                                        x={(margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)}
                                        y={yScale(value.median)}
                                        fill={scenarioColorPalette[i]}
                                        stroke={hoveredRect.severity === severity &&
                                            hoveredRect.scenario === scenario ? colors.blue: scenarioColorPalette[i]}
                                        strokeWidth={4}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </rect>
                                    <text 
                                        className='tick'
                                        opacity={0.65}
                                        textAnchor='middle'
                                        x={(margin.left * 2) + (j * ((barWidth) + barMargin)) + xScale(scenario) - 7 + (j*3.5) + (barWidth * 0.5) }
                                        y={height - 22}
                                    >{severity}</text>
                                    <line
                                        key={`vertline-${scenario}-${severity}`}
                                        className={`vertline-${scenario}-${severity}`}
                                        x1={(barWidth/2 + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))}
                                        y1={yScale(value.ninetyith)}
                                        x2={(barWidth/2 + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))}
                                        y2={yScale(value.tenth)}
                                        stroke={gray}
                                        strokeWidth={1}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </line>
                                    <line
                                        key={`topline-${scenario}-${severity}`}
                                        className={`topline-${scenario}-${severity}`}
                                        x1={(whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))}
                                        y1={yScale(value.ninetyith)}
                                        x2={(barWidth - whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))}
                                        y2={yScale(value.ninetyith)}
                                        stroke={gray}
                                        strokeWidth={1}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </line>
                                    <line
                                        key={`bottomline-${scenario}-${severity}`}
                                        className={`bottomline-${scenario}-${severity}`}
                                        x1={(whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))}
                                        y1={yScale(value.tenth)}
                                        x2={(barWidth - whiskerMargin + (margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario))}
                                        y2={yScale(value.tenth)}
                                        stroke={gray}
                                        strokeWidth={1}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                    </line>
                                    <Tooltip
                                        key={`tooltip-chart-${i}-${j}`}
                                        title={tooltipText}
                                        visible={hoveredRect.severity === severity &&
                                                hoveredRect.scenario === scenario ? true : false}
                                        data-html="true"
                                    >
                                        {/* debug red rect highlight */}
                                        <rect
                                            d={value}
                                            key={`bar-${scenario}-${severity}-hover`}
                                            className={'bars-hover'}
                                            width={barWidth}
                                            // height={this.state.yScale(0) - this.state.yScale(value.median)}
                                            height={yScale(value.median) / (height - margin.bottom) > 0.9 ? 20 : yScale(0) - yScale(value.median)}
                                            x={(margin.left * 2) + (j * (barWidth + barMargin)) + xScale(scenario)}
                                            y={yScale(value.median) / (height - margin.bottom) > 0.9 ? height - margin.bottom - 20 : yScale(value.median)}
                                            fill={'red'}
                                            fillOpacity={0}
                                            stroke={'red'}
                                            strokeOpacity={0}
                                            strokeWidth={4}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={(e) => this.handleHighlightEnter(e, severity, scenario, i)}
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
                )}
            )}
            </Fragment>
        )
    }

    handleHighlightEnter = _.debounce((event, severity, scenario, index) => {
        const { rectIsHovered, quantileObj } = this.state;
        if (!rectIsHovered) {
            const hoveredRect = {
                'severity': severity,
                'scenario': scenario,
                'index': index
            }
            const { stat, statLabel, scenarios, handleCalloutInfo, handleScenarioHover } = this.props;
            const median = quantileObj[stat][scenario][severity]['median']
            const tenth = quantileObj[stat][scenario][severity]['tenth']
            const ninetyith = quantileObj[stat][scenario][severity]['ninetyith']
            const severityText = stat === 'incidI' ? '' : `${capitalize(severity)} Severity<br>`;
            const text =    `${scenarios[index].replace('_', ' ')}<br>` +
                            severityText +
                            `p90: ${addCommas(Math.ceil(ninetyith))}<br>` +
                            `median: ${addCommas(Math.ceil(median))}<br>` +
                            `p10: ${addCommas(Math.ceil(tenth))}<br>`
    
            const tooltipText = () =>  (<div dangerouslySetInnerHTML={{__html: text}}></div>)

            this.setState({ hoveredRect, rectIsHovered: true, tooltipText })
            handleCalloutInfo( statLabel, median, tenth, ninetyith, true );
            handleScenarioHover( index );
        }
    }, 100)

    handleHighlightLeave = _.debounce(() => {
        const { rectIsHovered } = this.state;
        if (rectIsHovered) {
            const hoveredRect = {
                'severity': '',
                'scenario': '',
                'index': 0
            }
            const { handleCalloutLeave, handleScenarioHover } = this.props;
            this.setState({ hoveredRect, rectIsHovered: false })
            handleCalloutLeave();
            handleScenarioHover( null );
        }
    }, 100)

    render() {
        const { scaleDomains, xScale, yScale } = this.state;
        const { width, height, statLabel, scenarios } = this.props;
        return (
            <div >
                {scaleDomains &&
                <Fragment>
                    <svg 
                        width={margin.yAxis}
                        height={height} 
                    >
                        <text
                            transform="rotate(-90)"
                            y={0}
                            x={0-(height / 2)}
                            dy="1em"
                            opacity={0.65}
                            textAnchor="middle"
                            style={{ fontSize: '1rem'}}
                            className="titleNarrow"
                        >
                            {statLabel}
                        </text>
                        <Axis 
                            ref={this.chartYAxisRef}
                            width={width}
                            height={height - margin.chartTop - margin.bottom}
                            orientation={'left'}
                            scale={yScale}
                            x={margin.yAxis}
                            y={0}
                            tickNum={4}
                        />
                    </svg>
                    <svg 
                    width={width}
                    height={height}
                    ref={this.chartRef}
                    >
                    {this.drawSummaryStats()}
                    <Axis 
                        ref={this.chartXAxisRef}
                        view={'chart'}
                        width={width}
                        height={height}
                        orientation={'bottom'}
                        scale={xScale}
                        x={0}
                        y={height - margin.bottom + 1}
                        tickNum={scenarios.length}
                        axisVisible={false}
                    />
                    </svg>
                </Fragment>}
            </div>
        )
    }
}

export default Chart 