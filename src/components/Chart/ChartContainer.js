import React, { Component } from 'react';
import Chart from '../Chart/Chart';
import SummaryLabel from '../Chart/SummaryLabel';
import ChartLegend from '../Chart/ChartLegend';
import { scenarioColors, blue } from '../../utils/constants'
import { getReadableDate } from '../../utils/utils'

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            parameters: [],
            parameterLabels: [],
            children: {},
            hoveredScenarioIdx: null
        }
    }

    componentDidMount() {
        this.drawSummaryStatCharts();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.start !== this.props.start 
            || prevProps.end !== this.props.end
            || prevProps.dataset !== this.props.dataset
            || prevProps.scenarios !== this.props.scenarios
            || prevProps.stats !== this.props.stats
            || prevProps.scale !== this.props.scale
            || prevProps.width !== this.props.width 
            || prevProps.height !== this.props.height) {
            // console.log('ComponentDidUpdate Summary Start or End or Dataset')
            this.drawSummaryStatCharts();
        }
    }

    // TODO: REname this function
    drawSummaryStatCharts = () => {
        const { children } = this.state;
        const parameters = this.props.stats.map( stat => stat.key )
        const parameterLabels = this.props.stats.map( stat => stat.name )
        // console.log('ChartContainer scenarios', this.props.scenarios)

        for (let [index, param] of parameters.entries()) {
            const child = {
                key: `${param}-chart`,
                chart: {},
            }

            child.chart = 
                <Chart
                    key={`${param}-chart`}
                    dataset={this.props.dataset}
                    scenarios={this.props.scenarios}
                    firstDate={this.props.firstDate}
                    start={this.props.start}
                    end={this.props.end}
                    stat={param}
                    statLabel={parameterLabels[index]}
                    stats={this.props.stats}
                    width={this.props.width}
                    height={this.props.height / parameters.length}
                    handleCalloutInfo={this.handleCalloutInfo}
                    handleCalloutLeave={this.handleCalloutLeave}
                    handleScenarioHover={this.handleScenarioHighlight}
                    scale={this.props.scale}
                />
            children[param] = child;
        } 
        this.setState({
            children,
            parameters,
            parameterLabels
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    }

    handleCalloutInfo = (statLabel, median, tenth, ninetyith) => {
        this.setState({ statLabel, median, tenth, ninetyith, rectIsHovered: true });
    }

    handleCalloutLeave = () => {
        this.setState({ rectIsHovered: false })
    }

    handleScenarioHighlight = (scenarioIdx) => {
        if (scenarioIdx !== null) {
            this.setState({ hoveredScenarioIdx: scenarioIdx })
        } else {
            this.setState({ hoveredScenarioIdx: null })
        }
    }

    render() {
        return (
            <div>
                <div className="scenario-title titleNarrow">Summary of</div>
                <div className="filter-label threshold-label callout callout-row">
                    <span className={this.props.datePickerActive ? 'underline-active' : 'bold underline'}>
                        {getReadableDate(this.props.start)}</span>&nbsp;to&nbsp;
                    <span className={this.props.datePickerActive ? 'underline-active' : 'bold underline'}>
                        {getReadableDate(this.props.end)}</span>
                </div>
                <div className="chart-callout" style={{ display: 'block !important'}}>
                    {(this.state.rectIsHovered && this.state.hoveredScenarioIdx) &&
                        <SummaryLabel 
                            classProps={'filter-label threshold-label callout'}
                            start={this.props.start}
                            end={this.props.end}
                            scenario={this.props.scenarios[this.state.hoveredScenarioIdx].replace('_',' ')}
                            label={this.state.statLabel.toLowerCase()}
                            median={this.state.median}
                            tenth={this.state.tenth}
                            ninetyith={this.state.ninetyith}
                        />
                    }
                </div>
                <div className="chart-legend-container">
                    <div className="chart-legend">
                    {this.props.scenarios.map( (scenario, index) => {
                        return (
                            <div key={`chart-item-${scenario}`} className="chart-item">
                                <div
                                    key={`legend-box-${scenario}`}
                                    className='legend-box'
                                    style={ {background: scenarioColors[index], 
                                            border: 'solid',
                                            borderColor: this.state.hoveredScenarioIdx === index ? blue : scenarioColors[index],
                                            width: '12px', 
                                            height: '12px', 
                                            marginRight: '5px'}}
                                ></div>
                                <div
                                    key={`legend-label-${scenario}`}
                                    className="titleNarrow"
                                >{scenario.replace('_',' ')} </div>
                            </div>
                        )
                    })
                    }
                    </div>
                    <ChartLegend />
                </div>
                {this.state.dataLoaded && this.state.parameters.map( (param, i) => {
                    return (
                        <div className="row" key={`chart-row-${param}`}>
                            <div className="chart" key={`chart-${param}`}>
                                {this.state.children[param].chart}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ChartContainer 