import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
import Chart from '../Chart/Chart';
import CalloutLabel from '../Chart/CalloutLabel';
import ChartLegend from '../Chart/ChartLegend';
import { COUNTYNAMES } from '../../utils/geoids';
import { getReadableDate } from '../../utils/utils';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            children: {},
            selectedStats: {},
            hoveredScenarioIdx: null
        }
    }

    componentDidMount() {
        this.drawCharts();
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

            this.drawCharts();
        }
    }

    drawCharts = () => {
        const { children } = this.state;
        const { stats, dataset, scenarios, width, height, scale } = this.props;

        for (let stat of stats) {
            const child = {
                key: `${stat.key}-chart`,
                chart: {},
            }
            child.chart = 
                <Chart
                    key={`${stat.key}-chart`}
                    dataset={dataset}
                    scenarios={scenarios}
                    scenarioMap={this.props.scenarioMap}
                    firstDate={this.props.firstDate}
                    start={this.props.start}
                    end={this.props.end}
                    stat={stat.key}
                    statLabel={stat.name}
                    stats={stats}
                    width={width}
                    height={height / Object.keys(stats).length}
                    handleCalloutInfo={this.handleCalloutInfo}
                    handleCalloutLeave={this.handleCalloutLeave}
                    handleScenarioHover={this.handleScenarioHighlight}
                    scale={scale}
                />
            children[stat.key] = child;
        } 
        this.setState({children, selectedStats: stats}, () => {
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
        // TODO: replace('_') should be formatTitle()
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Fragment>
                <Row>
                    <Col span={24}>
                        <div className="scenario-title titleNarrow">{countyName}</div>
                        <div className="filter-label threshold-label callout callout-row">
                            {`Snapshot from `}
                            <span className={this.props.datePickerActive ? 'underline-active' : 'bold underline'}>
                                {getReadableDate(this.props.start)}</span>&nbsp;to&nbsp;
                            <span className={this.props.datePickerActive ? 'underline-active' : 'bold underline'}>
                                {getReadableDate(this.props.end)}</span>
                        </div>
                    </Col>
                </Row>

                <Row justify="end">
                    <div className="widescreen-only">
                        <div className="chart-callout" style={{ display: 'block !important'}}>
                            {this.state.hoveredScenarioIdx !== null &&
                                <CalloutLabel 
                                    classProps={'filter-label callout'}
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
                    </div>

                    <div className="chart-legend-container">
                        <ChartLegend />
                    </div>
                </Row>
                <Row>
                {this.state.dataLoaded && this.state.selectedStats.map(stat => {
                    return (
                        <div className="row" key={`chart-row-${stat.key}`}>
                            <div className="chart" key={`chart-${stat.key}`}>
                                {this.state.children[stat.key].chart}
                            </div>
                        </div>
                    )
                })}
                </Row>
            </Fragment>
        )
    }
}

export default ChartContainer 