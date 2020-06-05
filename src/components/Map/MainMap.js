import React, { Component, Fragment } from 'react';
import { Layout, Row, Col } from 'antd';
import MapContainer from './MapContainer';
import Scenarios from '../Filters/Scenarios';
import DateSlider from './DateSlider';
import { styles, COUNTYNAMES } from '../../utils/constants';
import { buildScenarios } from '../../utils/utils';
import { utcParse, timeFormat } from 'd3-time-format'

const geojsonStats = require('../../store/statsForMap.json')
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
            countyBoundaries: { "type": "FeatureCollection", "features": []},
            statsForCounty: {},
            currentDateIndex: 0,
            dataLoaded: false
        };
    };

    componentDidMount() {
        const { geoid, dataset } = this.props;
        this.initializeMap(geoid, dataset)
    };

    componentDidUpdate(prevProp) {
        const { geoid, dataset } = this.props;

        if (geoid !== prevProp.geoid ||
            dataset !== prevProp.dataset) {
            this.initializeMap(geoid, dataset)
            }
    };

    initializeMap(geoid, dataset) {
        // instantiate scenarios and dates
        const SCENARIOS = buildScenarios(dataset);  
        const scenario = SCENARIOS[0].key;       
        const dates = dataset[scenario].dates.map( d => parseDate(d));
        
        // instantiate stats and boundaries given geoid
        const state = geoid.slice(0, 2);
        const countyBoundaries = require('../../store/countyBoundaries.json')[state];
        const statsForCounty = geojsonStats[state];
        const currentDateIndex = dates
            .findIndex(date => formatDate(date) === formatDate(new Date()));

        this.setState({
            datasetMap: dataset, 
            dates,
            SCENARIOS,
            scenario,
            countyBoundaries,
            statsForCounty,
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

    render() {
        const { Content } = Layout;
        const { dates, currentDateIndex, SCENARIOS } = this.state;
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="geographic-map" style={styles.ContainerGray}>
                  <Col className="gutter-row container" span={16}>
                    <div className="content-section">
                            <div className="vis-content">
                              <div className="titleNarrow description-header">A daily understanding of regional context</div>
                                Hover over individual counties for more information
                                for each indicator. Slide over the date selector to 
                                view specific dates on the map. Use the right and
                                left arrow keys to increase or decrease by day.
                            </div>
                            {/* <div className="content-header">{countyName}</div> */}
                        </div>
                    </Col>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row container" span={16} style={styles.MapContainer}>
                            <div className="map-container">
                                <MapContainer
                                    geoid={this.props.geoid}
                                    dataset={this.state.datasetMap}
                                    width={this.props.width}
                                    height={this.props.height}
                                    scenario={this.state.scenario}
                                    firstDate={dates[0]}
                                    selectedDate={dates[currentDateIndex]}
                                    countyBoundaries={this.state.countyBoundaries}
                                    statsForCounty={this.state.statsForCounty}
                                    dateSliderActive={this.state.dateSliderActive}
                                />
                            </div>
                        </Col>

                        <Col className="gutter-row filters" span={6}>
                            {this.state.dataLoaded &&
                            <Fragment>
                                <Scenarios
                                    view="map"
                                    // temporary fix for different scenario array lengths between dataset and map
                                    SCENARIOS={SCENARIOS.length > 3 ? SCENARIOS.slice(0, 3) : SCENARIOS}
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
        )
    }
}

export default MainMap