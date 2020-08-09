import React, { Component, Fragment } from 'react';
import { Alert, Col, Layout, Row, Spin } from 'antd';
import MapContainer from './MapContainer';
import Scenarios from '../Filters/Scenarios.tsx';
import DateSlider from './DateSlider';
import { styles } from '../../utils/constants';
import { buildScenarios } from '../../utils/utils';
import { fetchJSON } from '../../utils/fetch';
import { timeFormat, utcParse } from 'd3-time-format'
import { connect } from 'react-redux';
import { fetchStatsForMap } from "../../redux/actions/statsForMap_actions";

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
            countyBoundaries: { "type": "FeatureCollection", "features": [] },
            statsForCounty: {},
            currentDateIndex: 0,
            dataLoaded: false,
            statsLoading: true
        };
    };

    componentDidMount() {
        this.props.fetchStatsForMap();
    };

    componentDidUpdate(prevProp) {
        const { geoid, dataset, statsForCounty } = this.props;

        if (geoid !== prevProp.geoid ||
            dataset !== prevProp.dataset ||
            statsForCounty !== prevProp.statsForCounty) {
            console.log("MainMap componentDidUpdate: initializeMap");
            this.initializeMap(geoid, this.props.dataset);
            this.setState({ statsLoading: false });
        }
    };

    initializeMap(geoid, dataset) {
        console.log('initializeMap statsForCounty', this.props.statsForCounty);
        // instantiate scenarios and dates
        const SCENARIOS = buildScenarios(dataset);
        const scenario = SCENARIOS[0].key;
        const dates = dataset[scenario].dates.map(d => parseDate(d));

        // instantiate stats and boundaries given geoid
        const state = geoid.slice(0, 2);
        const countyBoundaries = require('../../store/countyBoundaries.json')[state];

        const currentDateIndex = dates
            .findIndex(date => formatDate(date) === formatDate(new Date()));

        this.setState({
            datasetMap: dataset,
            dates,
            SCENARIOS,
            scenario,
            countyBoundaries,
            currentDateIndex,
        }, () => {
            this.setState({ dataLoaded: true });
        })
    }

    handleScenarioClick = (item) => {
        this.setState({ scenario: item })
    };

    handleMapSliderChange = (index) => {
        this.setState({ currentDateIndex: +index })
    };

    handleSliderMouseEvent = (type) => {
        if (type === 'mousedown') {
            this.setState({ dateSliderActiveMap: true })
        } else {
            this.setState({ dateSliderActiveMap: false })
        }
    }

    render() {
        const { Content } = Layout;
        const { dates, currentDateIndex, SCENARIOS, statsLoading, dataLoaded } = this.state;
        const { statsForCounty } = this.props;
        const statsLen = statsForCounty && Object.keys(statsForCounty).length;

        return (
            <Content id="geographic-map" style={styles.ContainerGray}>
                <Col className="gutter-row container">
                    <div className="content-section">
                        <div className="card-content">
                            <div className="titleNarrow description-header">
                                A daily look at regional context
                            </div>
                            Hover over individual counties for more information
                            for each indicator. Slide over the date selector to
                            view specific dates on the map. Use the right and
                            left arrow keys to increase or decrease by day.
                            <div className="mobile-alert">
                                &#9888; Please use a desktop to access the full feature set.
                            </div>
                        </div>
                    </div>
                </Col>
                <Row gutter={styles.gutter}>
                    <Col className="gutter-row container" style={styles.MapContainer}>
                        <div className="map-container">
                            {/* Loaded Map, statsForCounty has been fetched */}
                            {dataLoaded && statsForCounty && statsLen > 0 &&
                            <MapContainer
                                geoid={this.props.geoid}
                                dataset={this.state.datasetMap}
                                width={this.props.width}
                                height={this.props.height}
                                scenario={this.state.scenario}
                                firstDate={dates[0]}
                                selectedDate={dates[currentDateIndex]}
                                countyBoundaries={this.state.countyBoundaries}
                                statsForCounty={statsForCounty}
                                dateSliderActive={this.state.dateSliderActive}
                            />}
                            {/* Loading finished but statsForCounty is undefined */}
                            {!statsLoading && statsForCounty && statsLen === 0 &&
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
                            <Scenarios
                                view="map"
                                // TODO: temporary fix for different scenario array lengths between dataset and map
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

// This is how you pick which redux states you want for a component
// In this function, you need to return the props for the component.
// This usually means you need to combine the parent props and the
// redux state.
function mapStateToProps(state, ownProps) {
    const { statsForMap } = state;

    let statsForCounty = null;
    const slicedGeoId = ownProps.geoid.slice(0, 2);
    if (statsForMap !== null && slicedGeoId !== null) {
        statsForCounty = statsForMap[slicedGeoId];
    }
    return {
        ...ownProps,
        statsForCounty,
    }
}

// This is how you pick which dispatch functions you want for a component.
// These functions will be accessible like a prop. this.props.fetchStatsForMap()
const mapDispatchToProps = {
    fetchStatsForMap
};

// This is how you connect mapStateToProps and mapDispatchToProps to this component.
export default connect(mapStateToProps, mapDispatchToProps)(MainMap)
