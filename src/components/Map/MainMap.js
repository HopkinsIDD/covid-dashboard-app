import React, { Component, Fragment } from 'react';
import { Layout, Row, Col, Spin, Alert } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import MapContainer from './MapContainer';
import Scenarios from '../Filters/Scenarios.tsx';
import DateSlider from './DateSlider';
import ViewModal from '../ViewModal.js';

import { styles } from '../../utils/constants';
import { buildScenarios } from '../../utils/utils';
import { fetchConfig } from '../../utils/fetch';
import { utcParse, timeFormat } from 'd3-time-format'

const parseDate = utcParse('%Y-%m-%d')
const formatDate = timeFormat('%Y-%m-%d')

class MainMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datasetMap: {},
            dates: [],
            SCENARIOS: [],
            scenario: '',         
            dateSliderActiveMap: false,
            countyBoundaries: {},
            indicatorsForCounty: {},
            currentDateIndex: 0,
            dataLoaded: false,
            isLoading: true,
            modalVisible: false,
            firstModalVisit: true,
            fetchErrors: ''
        };
        this.scrollElemMap = React.createRef();
    };

    async componentDidMount() {
        const { dataset } = this.props;
        try {
            this.setState({isLoading: true});
            const indicatorsForMap = await fetchConfig('statsForMap');
            const stateBoundaries = await fetchConfig('countyBoundaries');

            this.setState({
                indicatorsForMap,
                stateBoundaries
            });
            this.initializeMap(dataset)
        } catch (e) {
            this.setState({fetchErrors: e.message})
        } 
        finally {
            // loading finishes if call is successful or fails
            this.setState({isLoading: false});
        }
        window.addEventListener("scroll", this.handleScroll, true);
    };

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll, true);
    }

    componentDidUpdate(prevProp) {
        const { dataset } = this.props;
        if (dataset !== prevProp.dataset) {
            this.initializeMap(dataset)        
        }
    };

    initializeMap(dataset) {
        const { geoid } = this.props;
        const { indicatorsForMap, stateBoundaries } = this.state;
        const state = geoid.slice(0, 2);

        if (Object.keys(dataset).length > 0 &&
            Object.keys(indicatorsForMap).length > 0 &&
            Object.keys(stateBoundaries).length > 0 
        ) {
            // instantiate scenarios and dates
            const SCENARIOS = buildScenarios(dataset);
            const scenario = SCENARIOS[0].key;       
            const dates = dataset[scenario].dates.map( d => parseDate(d));
            
            const currentDateIndex = dates
                .findIndex(date => formatDate(date) === formatDate(new Date()));

            this.setState({
                datasetMap: dataset, 
                dates,
                SCENARIOS,
                scenario,
                indicatorsForCounty: indicatorsForMap[state],
                countyBoundaries: stateBoundaries[state],
                currentDateIndex,
            }, () => {
                this.setState({dataLoaded: true});
            })
        } else {
            if (Object.keys(dataset).length === 0) console.log('Map Error: Dataset is empty');
            if (Object.keys(indicatorsForMap).length === 0) console.log('Map Error: indicatorsForMap is empty');
            if (Object.keys(stateBoundaries).length === 0) console.log('Map Error: stateBoundaries is empty');
        }
    }

    handleScenarioClick = (item) => {this.setState({scenario: item})};

    handleMapSliderChange = (index) => {this.setState({currentDateIndex: +index})};

    handleSliderMouseEvent = (type) => {
        if (type === 'mousedown') {
            this.setState({ dateSliderActiveMap: true })
        } else {
            this.setState({ dateSliderActiveMap: false })
        }
    }

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
        if(this.scrollElemMap.current && this.state.firstModalVisit && 
            (document.body.scrollTop > this.scrollElemMap.current.offsetTop - 60 && 
                document.body.scrollTop < this.scrollElemMap.current.offsetTop)) {
            this.setState({
                modalVisible: true,
            });
        }
    }

    render() {
        const { Content } = Layout;
        const { dates, currentDateIndex, SCENARIOS } = this.state;
        const { isLoading, dataLoaded, indicatorsForCounty } = this.state;
        const indicatorsLen = Object.keys(indicatorsForCounty).length;

        return (
            <div ref={this.scrollElemMap}>
                <Content id="geographic-map" style={styles.ContainerGray}>
                    {/* Loaded Map, indicatorsForCounty has been fetched */}
                    {dataLoaded && indicatorsLen > 0 &&
                    <Row gutter={styles.gutter}>
                        <Col className="gutter-row container" style={styles.MapContainer}>
                            <ViewModal 
                                modalTitle="Interpreting the map view"
                                modalVisible={this.state.modalVisible}
                                onCancel={this.handleModalCancel}
                                modalContainer="#geographic-map"
                                modalText={
                                    <div>
                                        <p>This map displays the projected mean point estimate mean value 
                                        (e.g., confirmed cases, hospitalizations, deaths) 
                                        per 10,000 population by county on a specific date.</p>
                                        <p>Use the control panel on the right to select a scenario and date for display in the map. 
                                        Hover over individual counties with your cursor for additional information. 
                                        Use the right and left arrow keys to increase or decrease by day.</p>
                                        <div className="mobile-alert">
                                            &#9888; Please use a desktop to access the full feature set.
                                        </div>
                                    </div>
                                }
                            />
                            <div className="map-container">
                                <MapContainer
                                    geoid={this.props.geoid}
                                    dataset={this.state.datasetMap}
                                    indicators={this.props.indicators}
                                    width={this.props.width}
                                    height={this.props.height}
                                    scenario={this.state.scenario}
                                    firstDate={dates[0]}
                                    selectedDate={dates[currentDateIndex]}
                                    countyBoundaries={this.state.countyBoundaries}
                                    indicatorsForCounty={indicatorsForCounty}
                                    dateSliderActive={this.state.dateSliderActive}
                                />
                            </div>
                        </Col>

                        <Col className="gutter-row filters"> 
                            {dataLoaded &&
                            <Fragment>
                                <div className="instructions-wrapper" onClick={this.showModal}>
                                    <div className="param-header instructions-label">INSTRUCTIONS</div>
                                    <div className="instructions-icon">
                                        <PlusCircleTwoTone />
                                    </div>
                                </div>
                                <Scenarios
                                    view="map"
                                    SCENARIOS={SCENARIOS}
                                    scenario={this.state.scenario}
                                    onScenarioClickMap={this.handleScenarioClick}
                                />
                                <DateSlider
                                    dates={dates}
                                    currentDateIndex={this.state.currentDateIndex.toString()}
                                    onMapSliderChange={this.handleMapSliderChange}
                                    onSliderMouseEvent={this.handleSliderMouseEvent}
                                />
                            </Fragment>
                            }
                        </Col>
                    </Row>}
                    {/* Loading finished but indicatorsForCounty is undefined */}
                    {!isLoading && indicatorsLen === 0 && 
                    <div className="error-container">
                        <Spin spinning={false}>
                            <Alert
                            message="Data Unavailable"
                            description={
                                <div>
                                    Geographic data is unavailable for county {this.props.geoid}. <br />
                                    {this.state.fetchErrors}
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

export default MainMap
