import React, { Component, Fragment } from 'react';
import { Layout, Row, Col } from 'antd';
import ChartContainer from './ChartContainer';
import Scenarios from '../Filters/Scenarios';
import DatePicker from './DatePicker';
import ScaleToggle from './ScaleToggle';
import IndicatorSelection from './IndicatorSelection';

import { styles, STATS, COUNTYNAMES } from '../../utils/constants';
import { buildScenarios } from '../../utils/utils';
import { utcParse } from 'd3-time-format'
const parseDate = utcParse('%Y-%m-%d')


class MainChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false,
            dates: [],
            allTimeDates: [],
            yAxisLabel: '',
            SCENARIOS: [],
            // scenario: {},
            scenarioListChart: [],
            statSliderActive: false,
            statListChart: [],
            datePickerActiveChart: false,
            firstDate: '',
            summaryStart: new Date(),
            summaryEnd: new Date(),
            summaryScale: 'power',
        };
    };

    componentDidMount() {
        const { dataset } = this.props;
        this.initializeChart(dataset)
    };

    componentDidUpdate(prevProp) {
        const { dataset } = this.props;

        if (dataset !== prevProp.dataset) {
            this.initializeChart(dataset)
        }
    };

    initializeChart(dataset) {
        // instantiate scenarios 
        const SCENARIOS = buildScenarios(dataset);  
        const scenarioListChart = SCENARIOS.map(s => s.name);

        // instantiate default 2 indicator stats
        const statListChart = STATS.slice(0,2)

        // instantiate start and end date (past 2 weeks) for summary stats
        const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
        const firstDate = dates[0];
        const summaryStart = new Date(); // TODO: make one line here
        // TODO: update variable names to remove words "chart" and "summary"
        summaryStart.setDate(summaryStart.getDate() - 14); 

        this.setState({
            dates,
            SCENARIOS,
            scenarioListChart,
            statListChart,
            firstDate, // TODO: get rid of this
            summaryStart,
        }
        // TODO: here in case you need it
        // , () => {
        //     this.setState({
        //         dataLoaded: true
        //     });
        // }
        )
    }

    handleScenarioClickChart = (items) => {
        let scenarioListChart = [];
        for (let item of items) {
            scenarioListChart.push(item)
        }

        this.setState({
            scenarioListChart
        })        
    }
    
    handleStatClickChart = (items) => {
        // items is Array of scenario names
        let newChartStats = []

        for (let item of items) {
            const chartStat = STATS.filter(s => s.key === item)[0];
            newChartStats.push(chartStat)
        }

        this.setState({
            statListChart: newChartStats
        })
    }

    handleSummaryDates = (start, end) => {
        this.setState({summaryStart: start, summaryEnd: end});
    };

    handleDatePicker = (datePickerOpen) => {
        this.setState({ datePickerActiveChart: datePickerOpen })
    }

    handleScaleToggle = (scale) => {this.setState({ summaryScale: scale })}

    render() {
        const { Content } = Layout;
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="stats" style={styles.ContainerWhite}>
                <div className="content-section">
                    <div className="content-header">{countyName}</div>
                </div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <div className="map-container">
                            <ChartContainer
                                geoid={this.props.geoid}
                                width={this.props.width}
                                height={this.props.height} 
                                dataset={this.props.dataset}
                                scenarios={this.state.scenarioListChart}
                                stats={this.state.statListChart}
                                firstDate={this.state.firstDate}
                                summaryStart={this.state.summaryStart}
                                summaryEnd={this.state.summaryEnd}
                                scale={this.state.summaryScale}
                                datePickerActive={this.state.datePickerActiveChart}
                            />
                        </div>
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <Fragment>
                            <Fragment>
                                <Scenarios 
                                    view="chart"
                                    SCENARIOS={this.state.SCENARIOS}
                                    scenario={this.state.SCENARIOS[0]} // TODO: fix this
                                    scenarioList={this.state.scenarioListChart}
                                    onScenarioClickChart={this.handleScenarioClickChart}
                                />
                                <IndicatorSelection
                                    statListChart={this.state.statListChart}
                                    onStatClickChart={this.handleStatClickChart}
                                />
                            </Fragment>
                            <DatePicker 
                                firstDate={this.state.firstDate}
                                summaryStart={this.state.summaryStart}
                                summaryEnd={this.state.summaryEnd}
                                onHandleSummaryDates={this.handleSummaryDates}
                                onHandleDatePicker={this.handleDatePicker}
                            />
                            <ScaleToggle
                                scale={this.state.summaryScale}
                                onScaleToggle={this.handleScaleToggle}
                            />
                        </Fragment>
                    </Col>
                </Row>
            </Content>
        )
    }
}

export default MainChart;