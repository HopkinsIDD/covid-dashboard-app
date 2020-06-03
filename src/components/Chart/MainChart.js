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
            dataLoaded: false,
            dates: [],
            SCENARIOS: [],
            scenarioList: [],
            statList: [],
            datePickerActive: false,
            start: new Date(),
            end: new Date(),
            scale: 'power',
        };
    };

    componentDidMount() {
        // console.log('MainChart componentDidMount')
        const { dataset } = this.props;
        this.initializeChart(dataset)
    };

    componentDidUpdate(prevProp) {
        // console.log('MainChart componentDidUpdate dataset', this.props.dataset)

        const { dataset } = this.props;

        if (dataset !== prevProp.dataset) {
            this.initializeChart(dataset)
        }
    };

    initializeChart(dataset) {
        // instantiate scenarios 
        const SCENARIOS = buildScenarios(dataset);  
        const scenarioList = SCENARIOS.map(s => s.name);
        // console.log('MainChart scenarioList', scenarioList)

        // instantiate default 2 indicator stats
        const statList = STATS.slice(0,2)

        // instantiate start and end date (past 2 weeks) for summary stats
        const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
        const start = new Date(); 
        start.setDate(start.getDate() - 14); 

        this.setState({
            dates,
            SCENARIOS,
            scenarioList,
            statList,
            start,
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    }

    handleScenarioClickChart = (items) => {
        let scenarioList = [];
        for (let item of items) {
            scenarioList.push(item)
        }
        this.setState({scenarioList});        
    }
    
    handleStatClickChart = (items) => {
        // items is Array of scenario names
        let newStats = []

        for (let item of items) {
            const stat = STATS.filter(s => s.key === item)[0];
            newStats.push(stat)
        }
        this.setState({
            statList: newStats
        })
    }

    handleSummaryDates = (start, end) => {this.setState({start: start, end: end})};

    handleDatePicker = (open) => {this.setState({datePickerActive: open })};

    handleScaleToggle = (scale) => {this.setState({ scale: scale })}

    render() {
        const { Content } = Layout;
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="stats" style={styles.ContainerWhite}>
                <Col className="gutter-row container" span={16}>
                    <div className="content-section">
                        <div>
                            Use this tool to plan for expected infections, hospitalizations,
                            ICU cases, ventilators needed, and deaths in your municipality.
                            For example, if you would like to know how many people will 
                            be hospitalized in 6 weeks, select hospitalizations  
                            as the indicator, today as the start date, and 6 weeks out
                            as the end date. Then, compare expected hospitalization 
                            numbers across all {this.state.SCENARIOS.length}&nbsp;
                            intervention scenarios at varying degrees of severity.
                        </div>
                        <div className="content-header">{countyName}</div>
                    </div>
                </Col>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <div className="map-container">
                            {this.state.dataLoaded &&
                            <ChartContainer
                                geoid={this.props.geoid}
                                width={this.props.width}
                                height={this.props.height} 
                                dataset={this.props.dataset}
                                scenarios={this.state.scenarioList}
                                stats={this.state.statList}
                                firstDate={this.state.dates[0]}
                                start={this.state.start}
                                end={this.state.end}
                                scale={this.state.scale}
                                datePickerActive={this.state.datePickerActive}
                            />
                            }
                        </div>
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <Fragment>
                            <Fragment>
                                <Scenarios 
                                    view="chart"
                                    SCENARIOS={this.state.SCENARIOS}
                                    scenarioList={this.state.scenarioList}
                                    onScenarioClickChart={this.handleScenarioClickChart}
                                />
                                <IndicatorSelection
                                    statList={this.state.statList}
                                    onStatClickChart={this.handleStatClickChart}
                                />
                            </Fragment>
                            <DatePicker 
                                firstDate={this.state.dates[0]}
                                start={this.state.start}
                                end={this.state.end}
                                onHandleSummaryDates={this.handleSummaryDates}
                                onHandleDatePicker={this.handleDatePicker}
                            />
                            <ScaleToggle
                                scale={this.state.scale}
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