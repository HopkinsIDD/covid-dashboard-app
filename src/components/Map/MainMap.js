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
            console.log('Fetch was problematic: ' + e.message)
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
            console.log('interactive map in view')
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
                    <Row gutter={styles.gutter}>
                        <Col className="gutter-row container" style={styles.MapContainer}>
                            <ViewModal 
                                modalTitle="A daily look at regional context"
                                modalVisible={this.state.modalVisible}
                                onCancel={this.handleModalCancel}
                                modalContainer="#geographic-map"
                                modalText={
                                    <div>
                                        Hover over individual counties for more information
                                        for each indicator. Slide over the date selector to 
                                        view specific dates on the map. Use the right and
                                        left arrow keys to increase or decrease by day.
                                        <div className="mobile-alert">
                                            &#9888; Please use a desktop to access the full feature set.
                                        </div>
                                    </div>
                                }
                            />
                            <div className="map-container">
                                {/* Loaded Map, indicatorsForCounty has been fetched */}
                                {dataLoaded && indicatorsLen > 0 &&
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
                                />}
                                {/* Loading finished but indicatorsForCounty is undefined */}
                                {!isLoading && indicatorsLen === 0 && 
                                    <Spin tip="Loading...">
                                        <Alert
                                        message="Data Unavailable"
                                        description="Geographic data is unavailable for selected county."
                                        type="info"
                                        />
                                    </Spin>}
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
                    </Row>
                </Content>
            </div>
        )
    }
}

export default MainMap
