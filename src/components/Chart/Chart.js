import React, { Component, Fragment } from 'react'; 
import { min, max, quantile } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { getDateIdx } from '../../utils/utils';
import { margin } from '../../utils/constants';
import Axis from '../Graph/Axis';
import { graphBkgd } from '../../utils/constants'

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
        console.log('componentDidMount')
        const { dataset, firstDate, summaryStart, summaryEnd, stat, width, height } = this.props;
        const { severities } = this.state;
        const quantileObj = {}
        
        const scenarios = Object.keys(dataset);
        const startIdx = getDateIdx(firstDate, summaryStart);
        const endIdx = getDateIdx(firstDate, summaryEnd);
        let globalMaxVal = 0;
        // console.log(scenarios)
        console.log(stat)
        quantileObj[stat] = {};
        for (let severity of severities) {
            console.log(severity)
            quantileObj[stat][severity] = {};
            for (let scenario of scenarios) {
                console.log(scenario)
                // every Chart has a given severity and stat passed down from ChartContainer
                // every Chart will contain all scenarios
                // startIdx and endIdx specify the time range on which we want to calc quantiles
                // every sim.vals array will be sliced on this timeRange 
                // then every day of a simulation will be summed up returning an Array of sim sums 
                // then d3.quantiles can be applied to the Array to create final desired obj
                
                const sumArray = dataset[scenario][severity][stat].sims.map(sim => 
                    sim.vals.slice(startIdx, endIdx).reduce((a, b) => a + b, 0));
                console.log(scenario, stat, severity, sumArray)
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
        
        console.log(quantileObj)
        const yScale = scaleLinear().range([height - margin.top - margin.bottom, margin.top]).domain([0, globalMaxVal]) // TODO: make this scale take into account the highest severity
        const xScale = scaleBand().range([0, width]).domain(scenarios).paddingInner(1).paddingOuter(.5);
        this.setState({ quantileObj, xScale, yScale, scaleDomains: true })
    }

    drawSummaryStats = () => {

    }

    render() {
        console.log(this.props.width, this.props.height)
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
                            y={margin.top}
                        />
                        </svg>
                        <svg 
                        width={this.props.width}
                        height={this.props.height} 
                        >
                            {
                                this.state.severities.map( (severity, i) => {
                                    return (
                                        <rect
                                            key={`severity-rect-${i}`}
                                            width={(this.props.width / this.state.severities.length) - margin.left}
                                            height={this.props.height}
                                            x={margin.left + (i * (this.props.width / this.state.severities.length))}
                                            y={0}
                                            fill={graphBkgd}
                                        >

                                        </rect>
                                    )
                                })
                            }
                        </svg>
                    </Fragment>
                  }
            </div>
        )
    }
}

export default Chart 