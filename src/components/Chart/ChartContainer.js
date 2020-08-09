import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
import Chart from '../Chart/Chart';
import CalloutLabel from '../Chart/CalloutLabel';
import ChartLegend from '../Chart/ChartLegend';
import { COUNTIES } from '../../utils/geoids.tsx';
import { getReadableDate, formatTitle } from '../../utils/utils';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            children: {},
            selectedIndicators: {},
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
            || prevProps.indicators !== this.props.indicators
            || prevProps.scale !== this.props.scale
            || prevProps.width !== this.props.width
            || prevProps.height !== this.props.height) {

            this.drawCharts();
        }
    }

    drawCharts = () => {
        const { children } = this.state;
        const { indicators, dataset, scenarios, width, height, scale } = this.props;

        for (let indicator of indicators) {
            const child = {
                key: `${indicator.key}-chart`,
                chart: {},
            }
            child.chart =
                <Chart
                    key={`${indicator.key}-chart`}
                    dataset={dataset}
                    scenarios={scenarios}
                    scenarioMap={this.props.scenarioMap}
                    firstDate={this.props.firstDate}
                    start={this.props.start}
                    end={this.props.end}
                    indicator={indicator.key}
                    statLabel={indicator.name}
                    indicators={indicators}
                    width={width}
                    height={height / Object.keys(indicators).length}
                    handleCalloutInfo={this.handleCalloutInfo}
                    handleCalloutLeave={this.handleCalloutLeave}
                    handleScenarioHover={this.handleScenarioHighlight}
                    scale={scale}
                />
            children[indicator.key] = child;
        }
        this.setState({children, selectedIndicators: indicators}, () => {
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
        const { hoveredScenarioIdx } = this.state;
        const { geoid, scenarios, datePickerActive } = this.props;
        const countyName = `${COUNTIES[geoid]}`;
        return (
            <Fragment>
                <Row>
                    <Col span={24}>
                        <div className="scenario-title titleNarrow">{countyName}</div>
                        <div className="filter-label threshold-label callout callout-row">
                            {`Snapshot from `}
                            {/*TS migration: Use getClassForActiveState(datePickerActive)*/}
                            <span className={datePickerActive ? 'underline-active' : 'bold underline'}>
                                {getReadableDate(this.props.start)}</span>&nbsp;to&nbsp;
                            {/*TS migration: Use getClassForActiveState(datePickerActive)*/}
                            <span className={datePickerActive ? 'underline-active' : 'bold underline'}>
                                {getReadableDate(this.props.end)}</span>
                        </div>
                    </Col>
                </Row>

                <Row justify="end">
                    <div className="widescreen-only">
                        <div className="chart-callout" style={{ display: 'block !important'}}>
                            {hoveredScenarioIdx !== null &&
                                <CalloutLabel
                                    classProps={'filter-label callout'}
                                    start={this.props.start}
                                    end={this.props.end}
                                    scenario={formatTitle(scenarios[hoveredScenarioIdx])}
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
                {this.state.dataLoaded && this.state.selectedIndicators.map(indicator => {
                    return (
                        <div className="row" key={`chart-row-${indicator.key}`}>
                            <div className="chart" key={`chart-${indicator.key}`}>
                                {this.state.children[indicator.key].chart}
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
