import React, { Component, Fragment } from 'react';
import { Layout, Row, Col, Spin, Alert } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import ChartContainer from './ChartContainer';
import Scenarios from '../Filters/Scenarios.tsx';
import DatePicker from './DatePicker';
import ScaleToggle from './ScaleToggle.tsx';
import IndicatorSelection from './IndicatorSelection';
import ViewModal from '../ViewModal.js';

import { styles } from '../../utils/constants';
import { buildScenarios, buildScenarioMap } from '../../utils/utils';
import { utcParse } from 'd3-time-format'
const parseDate = utcParse('%Y-%m-%d')


class MainChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            datasetChart: {},
            dates: [],
            SCENARIOS: [],
            scenarioList: [],   // selected scenarios in Chart view
            scenarioMap: {},    // maps all scenarios to list of severities
            statList: [],
            datePickerActive: false,
            start: new Date(),
            end: new Date(),
            scale: 'power', // TS migration: ScaleTypeEnum
            modalVisible: false,
            firstModalVisit: true,
        };
        this.scrollElemChart = React.createRef();
    };

    componentDidMount() {
        const { dataset } = this.props;
        this.initializeChart(dataset);
        window.addEventListener("scroll", this.handleScroll, true);
    };

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll, true);
    };

    componentDidUpdate(prevProp) {
        const { dataset } = this.props;

        if (dataset !== prevProp.dataset) {
            this.initializeChart(dataset)
        }
    };

    initializeChart(dataset) {
        if (Object.keys(dataset).length > 0) {
            // instantiate scenarios, initial default indicators
            const SCENARIOS = buildScenarios(dataset);  
            const scenarioList = SCENARIOS.map(s => s.name);
            const scenarioMap = buildScenarioMap(dataset);
            const statList = this.props.indicators.slice(0,2)

            // instantiate start and end date (past 2 weeks) for summary indicators
            const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
            const start = new Date(); 
            start.setDate(start.getDate() - 14); 

            // dataset needs to be set to state at the same time as other props
            // otherwise, children updates will occur at different times
            this.setState({
                datasetChart: dataset, 
                dates,
                SCENARIOS,
                scenarioList,
                scenarioMap,
                statList,
                start,
                dataLoaded: true
            });
        }
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
        let newIndicators = []
        for (let item of items) {
            const indicator = this.props.indicators.filter(s => s.key === item)[0];
            newIndicators.push(indicator)
        }
        this.setState({
            statList: newIndicators
        })
    }

    handleSummaryDates = (start, end) => {this.setState({start: start, end: end})};

    handleDatePicker = (open) => {this.setState({datePickerActive: open })};

    handleScaleToggle = (scale) => {this.setState({ scale: scale })}

    handleModalCancel = (e) => {
        // console.log(e);
        this.setState({
            modalVisible: false,
            firstModalVisit: false,
        });
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    }

    handleScroll = (e) => {
        if(this.scrollElemChart.current && this.state.firstModalVisit && 
            (document.body.scrollTop > this.scrollElemChart.current.offsetTop - 60 && 
                document.body.scrollTop < this.scrollElemChart.current.offsetTop)) {
            this.setState({
                modalVisible: true,
            });
        }
    }

    render() {
        const { Content } = Layout;
        const datasetLen = Object.keys(this.props.dataset).length;

        return (
            <div ref={this.scrollElemChart}>
                <Content id="exploration" style={styles.ContainerWhite}>
                    {/* Loaded Chart, dataset has been fetched successfully */}
                    {this.state.dataLoaded && datasetLen > 0 &&
                    <Row gutter={styles.gutter}>
                        <Col className="gutter-row container">
                            <ViewModal 
                                modalTitle="Interpreting the aggregate statistics graph"
                                modalVisible={this.state.modalVisible}
                                onCancel={this.handleModalCancel}
                                modalContainer="#exploration"
                                modalText={
                                    <div>
                                        <p>This graph shows the distribution of a projected indicator 
                                        (e.g., confirmed cases, hospitalizations, deaths) 
                                        across model simulations in your state or county for 
                                        different scenarios over a specific period of time.</p>
                                        <p>Use the control panel on the right side to:</p>
                                        <ul>
                                            <li>Select scenarios for comparison</li>
                                            <li>Select indicators of interest</li>
                                            <li>Narrow the date range of interest</li>
                                            <li>Change the transformation applied to the y-axis scale</li>
                                        </ul>
                                        <div className="mobile-alert">
                                            &#9888; Please use a desktop to access the full feature set, 
                                            including selecting indicators and date range.
                                        </div>
                                    </div>
                                }
                            />
                            <div className="map-container">
                                <ChartContainer
                                    geoid={this.props.geoid}
                                    width={this.props.width}
                                    height={this.props.height} 
                                    dataset={this.state.datasetChart}
                                    scenarios={this.state.scenarioList}
                                    scenarioMap={this.state.scenarioMap}
                                    indicators={this.state.statList}
                                    firstDate={this.state.dates[0]}
                                    start={this.state.start}
                                    end={this.state.end}
                                    scale={this.state.scale}
                                    datePickerActive={this.state.datePickerActive}
                                />
                            </div>
                        </Col>

                        <Col className="gutter-row container mobile-only">
                            <div className="mobile-alert">
                                &#9888; The filters below are disabled on mobile devices.
                            </div>
                        </Col>

                        <Col className="gutter-row filters mobile">
                            <Fragment>
                                <div className="instructions-wrapper" onClick={this.showModal}>
                                    <div className="param-header instructions-label">INSTRUCTIONS</div>
                                    <div className="instructions-icon">
                                        <PlusCircleTwoTone />
                                    </div>
                                </div>
                                <Fragment>
                                    <Scenarios 
                                        view="chart"
                                        SCENARIOS={this.state.SCENARIOS}
                                        scenarioList={this.state.scenarioList}
                                        onScenarioClickChart={this.handleScenarioClickChart}
                                    />
                                    <IndicatorSelection
                                        statList={this.state.statList}
                                        indicators={this.props.indicators}
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
                    </Row>}
                    {/* Loaded Chart,but dataset is undefined */}
                    {datasetLen === 0 && 
                    <div className="error-container">
                        <Spin spinning={false}>
                            <Alert
                            message="Data Unavailable"
                            description={
                                <div>
                                    Simulation data for county {this.props.geoid} is
                                    unavailable or in an unexpected format.
                                </div>
                            }
                            type="info"
                            />
                        </Spin>
                    </div>}
                </Content>
            </div>
        )
    }
}

export default MainChart;