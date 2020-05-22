import React, { Component, Fragment } from 'react'; 
import { min, max, quantile } from 'd3-array';
import { scaleBand, scalePow } from 'd3-scale';
import { getDateIdx } from '../../utils/utils';
import { margin } from '../../utils/constants';
import Axis from '../Graph/Axis';
import { graphBkgd, green, gray } from '../../utils/constants'

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            severities: ['high', 'med', 'low'],
            scaleDomains: false,
            // quantileObj: {}
        }
    }
    componentDidMount() {
        console.log('componentDidMount');
        this.calculateQuantiles();
        
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(this.props.summaryStart, this.props.summaryEnd)
        if (prevProps.summaryStart !== this.props.summaryStart || prevProps.summaryEnd !== this.props.summaryEnd) {
            // console.log('summary Start or End Changed');
            this.calculateQuantiles();
        }
    }

    calculateQuantiles = () => {
        const { dataset, firstDate, summaryStart, summaryEnd, stat, width, height } = this.props;
        const { severities } = this.state;
        const quantileObj = {}
        
        const scenarios = Object.keys(dataset);
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
        // const yScale = scaleLinear().range([height - margin.bottom, margin.top]).domain([0, globalMaxVal]) // 
        // const yScale = scaleLog().range([height - margin.bottom, margin.top]).domain([1, globalMaxVal]) //
        const yScale = scalePow().exponent(0.25).range([height - margin.bottom, margin.top]).domain([0, globalMaxVal])
        const xScale = scaleBand().range([margin.left, (width / severities.length) - margin.right]).domain(scenarios).paddingInner(1).paddingOuter(.5);
        this.setState({ quantileObj, xScale, yScale, scaleDomains: true })
    }

    handleHighlight = (severity, key) => {
        // console.log(severity, key)
    }

    drawSummaryStats = () => {
        const barWidth = 40;
        const whiskerMargin = 8;
        return (
            this.state.severities.map( (severity, i) => {
            return (
                <Fragment key={`chart-fragment-${severity}`}>
                <rect
                    key={`chart-rect-${severity}`}
                    width={(this.props.width / this.state.severities.length) - margin.left}
                    height={this.props.height - margin.top - margin.bottom}
                    x={margin.left + (i * (this.props.width / this.state.severities.length))}
                    y={margin.top}
                    fill={graphBkgd}
                >
                </rect>
                <g key={`chart-group-${severity}`}>
                    { Object.entries(this.state.quantileObj[this.props.stat][severity]).map( ([key, value], j) => {
                    return (
                        <Fragment key={`chart-fragment-${severity}-${key}`}>
                            <rect 
                                key={`bar-${severity}-${key}`}
                                width={40}
                                height={this.state.yScale(0) - this.state.yScale(value.median)}
                                x={(i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key)}
                                y={this.state.yScale(value.median)}
                                fill={green}
                                onMouseEnter={(severity, key) => this.handleHighlight(severity, key)}
                            >
                            </rect>
                            <line
                                key={`vertline-${severity}-${key}`}
                                x1={(barWidth/2 + (i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key))}
                                y1={this.state.yScale(value.ninetyith)}
                                x2={(barWidth/2 + (i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key))}
                                y2={this.state.yScale(value.tenth)}
                                stroke={gray}
                                strokeWidth={1}
                            >
                            </line>
                            <line
                                key={`topline-${severity}-${key}`}
                                x1={(whiskerMargin + (i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key))}
                                y1={this.state.yScale(value.ninetyith)}
                                x2={(barWidth - whiskerMargin + (i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key))}
                                y2={this.state.yScale(value.ninetyith)}
                                stroke={gray}
                                strokeWidth={1}
                            >
                            </line>
                            <line
                                key={`bottomline-${severity}-${key}`}
                                x1={(whiskerMargin + (i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key))}
                                y1={this.state.yScale(value.tenth)}
                                x2={(barWidth - whiskerMargin + (i * (this.props.width / this.state.severities.length) - margin.left - margin.right) + this.state.xScale(key))}
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

    render() {
        // console.log(this.props.width, this.props.height)
        
        return (
            <div >
                <div className="y-axis-label chart-yLabel titleNarrow">
                  {this.props.stat}
                  </div>
                  {this.state.scaleDomains &&
                    <Fragment>
                        <svg 
                            width={margin.yAxis}
                            height={this.props.height} 
                        >
                        <Axis 
                            width={this.props.width}
                            height={this.props.height - margin.top - margin.bottom}
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