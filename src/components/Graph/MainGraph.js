import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import _ from 'lodash';
import GraphContainer from './GraphContainer';
import Brush from '../Filters/Brush';
import Scenarios from '../Filters/Scenarios';
import Indicators from '../Filters/Indicators';
import SeverityContainer from '../Filters/SeverityContainer'
import ActualSwitch from '../Filters/ActualSwitch';
import R0 from '../Filters/R0';
import ModeToggle from '../Filters/ModeToggle';
import Sliders from '../Filters/Sliders';

import { styles, margin, numDisplaySims, STATS, LEVELS } from '../../utils/constants';
import { buildScenarios, getR0range, getConfBounds, getActuals, filterR0 } 
    from '../../utils/utils';
import { getStatThreshold, getDateThreshold, flagSimsOverThreshold, 
    getExceedences, flagSims, filterByDate } from '../../utils/threshold';
import { utcParse } from 'd3-time-format';
import { timeDay } from 'd3-time';

const parseDate = utcParse('%Y-%m-%d');

class MainGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            series: {},
            seriesList: [],
            allDatesSeries: {},       // used by Brush, entire series selection
            selectedDates: [],        // selected dates only
            dates: [],                // used by Brush, entire date selection
            stat: STATS[0],
            SCENARIOS: [],
            scenarioList: [],           
            severity: _.cloneDeep(LEVELS[0]), 
            severityList: [_.cloneDeep(LEVELS[0])],
            scenarioHovered: '',
            statThreshold: 0,
            statSliderActive: false,
            seriesMax: Number.NEGATIVE_INFINITY, 
            seriesMin: Number.POSITIVE_INFINITY,
            dateThreshold: new Date(),
            dateRange: [parseDate('2020-03-01'), parseDate('2020-07-27')],
            showActual: false,
            actualList: [],
            r0full: [0, 4],                 // full range of r0
            r0selected: [0, 4],             // used selected range of r0
            seriesListForBrush: [],       // used by Brush in handler
            percExceedenceList: [],
            confBounds: {},
            showConfBounds: false,
            confBoundsList: [],
            brushActive: false,
            animateTransition: true,
            scenarioClickCounter: 0,
        };
    };

    componentDidMount() {
        const { severity, stat } = this.state;
        this.initialize(this.props.dataset, stat, severity);
    };

    componentDidUpdate(prevProp) {
        const { severity, stat } = this.state;
        if (this.props.dataset !== prevProp.dataset) {
            this.initialize(this.props.dataset, stat, severity)
        }
    };

    initialize = (dataset, stat, severity) => {
        // initialize() trigged on mount and Dataset change
        const { dateRange, severityList } = this.state

        // SCENARIOS: constant scenarios used for a given geoid
        const SCENARIOS = buildScenarios(dataset);  
        const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
        const series = dataset[SCENARIOS[0].key][severity.key][stat.key]
            .sims.slice(0, numDisplaySims);
        const sevList = _.cloneDeep(severityList);
        sevList[0].scenario = SCENARIOS[0].key;

        // allSims used for R0 histogram
        const allSims = dataset[SCENARIOS[0].key][severity.key][stat.key].sims;

        // initialize Threshold and slider ranges
        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);
        const [statThreshold, seriesMin, seriesMax] = getStatThreshold(
            [SCENARIOS[0]], [series], idxMin, idxMax);
        const simsOver = flagSims(
            series, statThreshold, dates, this.state.dateThreshold)        
        const newSelectedDates = Array.from(dates).slice(idxMin, idxMax);
        const filteredSeries = filterByDate(series, idxMin, idxMax)

        const confBoundsList = getConfBounds(
            dataset, [SCENARIOS[0]], severityList, stat, dates, idxMin, idxMax)
        const actualList = getActuals(this.props.geoid, stat, [SCENARIOS[0]]);

        const r0full = getR0range(dataset, SCENARIOS[0], severity, stat);
        // seriesListForBrush used by handleBrush to initialize instead of R0 filtering 
        // series is updated and set to state in scenario, sev, stat, r0 change handlers
        const seriesListForBrush = filterR0(
            r0full, [SCENARIOS[0]], sevList, stat, dataset, numDisplaySims);

        this.setState({
            SCENARIOS,
            scenarioList: [SCENARIOS[0]],
            selectedDates: newSelectedDates,
            dates: Array.from(dates),                  // dates for brush
            allDatesSeries: Array.from(series),        // series for brush
            allSims,
            seriesList: [filteredSeries],
            severityList: sevList,
            seriesMax,
            seriesMin,
            statThreshold,
            percExceedenceList: [simsOver / series.length],
            confBoundsList,
            showConfBounds: false,
            actualList,
            r0full,
            r0selected: r0full, 
            seriesListForBrush 
        }, () => {
            this.setState({dataLoaded: true});
        })
    }

    update = (seriesList, scenarioList, stat, severityList, dateRange) => {
        // update() triggered on Scenario, Stat, Severity, R0, Brush change
        const { dataset, geoid } = this.props;
        const { dates } = this.state;
        
        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);

        const newSelectedDates = Array.from(dates).slice(idxMin, idxMax);

        const dateThreshold = getDateThreshold(dates, idxMin, idxMax);
        const [statThreshold, seriesMin, seriesMax] = getStatThreshold(
            scenarioList, seriesList, idxMin, idxMax);

        const [flaggedSeriesList, simsOverList] = flagSimsOverThreshold(
            scenarioList, seriesList, dates, idxMin, idxMax, 
            statThreshold, dateThreshold)

        const percExceedenceList = getExceedences(
            scenarioList, seriesList, simsOverList);

        const confBoundsList = getConfBounds(
            dataset, scenarioList, severityList, stat, dates, idxMin, idxMax)
        const actualList = getActuals(geoid, stat, scenarioList);

        this.setState({
            seriesList: flaggedSeriesList,
            allDatesSeries: seriesList[0],  // brush uses first series
            selectedDates: newSelectedDates,
            statThreshold,
            dateThreshold,
            seriesMin,
            seriesMax,
            percExceedenceList,
            confBoundsList,
            actualList
        })
    }

    handleIndicatorClick = (stat) => {
        const { dataset } = this.props;
        const { scenarioList, severityList, r0selected, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);

        this.setState({stat, seriesListForBrush: seriesList, animateTransition: true})
        this.update(seriesList, scenarioList, stat, severityList, dateRange);
    };

    handleScenarioClickGraph = (items) => {
        // items is Array of scenario names
        const { dataset } = this.props;
        const { stat, r0selected, dateRange } = this.state;

        const scenarioClkCntr = this.state.scenarioClickCounter + 1;
        let scenarioList = [];
        let severityList = [];

        // associate each severity with a scenario to enable hover over severity label
        for (let item of items) {
            const defaultSev = _.cloneDeep(LEVELS[0]); 
            defaultSev.scenario = item;
            severityList.push(defaultSev)

            const scenario = this.state.SCENARIOS.filter(s => s.key === item)[0];
            scenarioList.push(scenario);
        }

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);
        
        this.setState({
            scenarioList,
            scenarioClickCounter: scenarioClkCntr,
            severityList,
            seriesListForBrush: seriesList,
            animateTransition: true
        })      
        this.update(seriesList, scenarioList, stat, severityList, dateRange); 
    };

    handleSeveritiesClick = (i) => {
        const { dataset } = this.props;
        const { scenarioList, stat, r0selected, dateRange } = this.state;

        let severityList = _.cloneDeep(this.state.severityList);
        severityList.forEach(sev => {
            if (sev.scenario === i.scenario) {
                return sev.key = i.key;
            }
        })
        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);
        
        this.setState({
            severityList, 
            seriesListForBrush: seriesList,
            animateTransition: true
        });
        this.update(seriesList, scenarioList, stat, severityList, dateRange); 
    };

    handleSeveritiesHover = (i) => {this.setState({scenarioHovered: i})};

    handleSeveritiesHoverLeave = () => {this.setState({scenarioHovered: ''});}

    handleR0Change = (r0selected) => {
        const { dataset } = this.props;
        const { scenarioList, severityList, stat, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);
        
        this.setState({
            r0selected,
            seriesListForBrush: seriesList,
            animateTransition: true
        })
        this.update(seriesList, scenarioList, stat, severityList, dateRange);     
    };

    handleR0Resample = () => {
        const { dataset } = this.props;
        const { scenarioList, severityList, stat, r0selected, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);
        
        this.setState({
            r0selected,
            seriesListForBrush: seriesList,
            animateTransition: true
        })
        this.update(seriesList, scenarioList, stat, severityList, dateRange);     
    };

    handleActualChange = () => {
        this.setState({showActual: !this.state.showActual}); 
    };

    handleStatSliderChange = (thresh) => {
        const { selectedDates, dateThreshold, dates } = this.state;
        const seriesList = Array.from(this.state.seriesList);
        const allDatesSeries = Array.from(this.state.allDatesSeries);
        // flag Sims for Brush
        flagSims(allDatesSeries, thresh, dates, dateThreshold);
        const percExceedenceList = [];
        // flag Sims for seriesList
        for (let i = 0; i < seriesList.length; i++) {
            const simsOver = flagSims(seriesList[i], thresh, selectedDates, dateThreshold);
            const percExceedence = simsOver / seriesList[i].length;
            percExceedenceList.push(percExceedence);
        }
        this.setState({
            seriesList,
            allDatesSeries,
            statThreshold: +thresh,
            percExceedenceList,
            animateTransition: false
        });
    };

    handleDateSliderChange = (thresh) => {
        const { statThreshold, selectedDates, dates } = this.state;
        const seriesList = Array.from(this.state.seriesList);
        const allDatesSeries = Array.from(this.state.allDatesSeries);
        // flag Sims for Brush
        flagSims(allDatesSeries, statThreshold, dates, thresh);
        const percExceedenceList = [];
        // flag Sims for seriesList
        for (let i = 0; i < seriesList.length; i++) {
            const simsOver = flagSims(seriesList[i], statThreshold, selectedDates, thresh);
            const percExceedence = simsOver / seriesList[i].length;
            percExceedenceList.push(percExceedence);
        }
        this.setState({
            seriesList,
            allDatesSeries,
            dateThreshold: thresh,
            percExceedenceList,
            animateTransition: false
        })
    }

    handleBrushRange = (dateRange) => {
        // console.log('handleBrushRange')
        const { seriesListForBrush, scenarioList, stat, severityList } = this.state;

        this.setState({
            dateRange, 
            animateTransition: false
        });
        this.update(seriesListForBrush, scenarioList, stat, severityList, dateRange);
    };

    handleBrushStart = () => { this.setState({brushActive: true, animateTransition: false} )}

    showConfBounds(confBoundsList) {
        // confBoundsList declared simply to control flow of state
        this.setState(prevState => ({
            showConfBounds: !prevState.showConfBounds, 
            animateTransition: false
        }));
    }

    handleConfClick = () => {
        const { dataset } = this.props;
        const { scenarioList, severityList, stat, dates, dateRange } = this.state;

        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);

        const confBoundsList = getConfBounds(
            dataset, scenarioList, severityList, stat, dates, idxMin, idxMax);

        this.setState({
            confBoundsList, 
            animateTransition: false
        });
        // show confidence bounds only after bounds have finished calculating
        this.showConfBounds(confBoundsList);
    };

    handleBrushEnd = () => { this.setState({brushActive: false, animateTransition: false} )}


    handleSliderMouseEvent = (type, slider, view) => {
        if (view === 'graph') {
            if (slider === 'stat') {
                if (type === 'mousedown') {
                    this.setState({ statSliderActive: true })
                } else {
                    this.setState({ statSliderActive: false })
                }
            } else {
                if (type === 'mousedown') {
                    this.setState({ dateSliderActive: true })
                } else {
                    this.setState({ dateSliderActive: false })
                }
            }
        } 
    }

    render() {
        const { Content } = Layout;
        return (
            <Content id="interactive-graph" style={styles.ContainerGray}>
                {/* text span is 1 grid value higher than Graph to allow text-wrapping */}
                <Col className="gutter-row container">
                    <div className="content-section">
                        <div className="card-content">
                            <div className="titleNarrow description-header">
                                What can scenario modeling tell us?
                            </div>
                            This graph aims to display as much about the scenario model as possible.
                            Each intervention scenario is represented by multiple 
                            simulation curves - each of these curves represent one 
                            possible outcome based on a given set of parameters. Each simulation 
                            curve is just as likely to occur as another. <br /><br />
                            <div className="desktop-only">
                                Select two intervention scenarios from the menu on
                                the right to compare side by side. Toggle between 
                                different indicators such as hospitalizations and deaths,
                                as well as the scenario's potential severity level. Filter 
                                simulations down to curves within a specific range of R<sub>0</sub>. 
                                You can also choose between exploring exceedence thresholds
                                and displaying confidence bounds. To explore exceedence, 
                                use the threshold sliders to change values and dates to determine
                                how likely a given indicator, such as hospitalizations, 
                                will exceed a certain number by a given date.
                            </div>
                            <div className="mobile-alert">
                                &#9888; Please use a desktop to access the full feature set, 
                                including scenario comparisons and filtering on R<sub>0</sub>.
                            </div>
                        </div>
                    </div>
                </Col>

                {this.state.dataLoaded &&
                <Row gutter={styles.gutter}>
                    <Col className="gutter-row container">
                        <GraphContainer 
                            geoid={this.props.geoid}
                            width={this.props.width}
                            height={this.props.height}
                            selectedDates={this.state.selectedDates}
                            scenarioList={this.state.scenarioList}
                            seriesList={this.state.seriesList}
                            stat={this.state.stat}
                            severity={this.state.severity}
                            r0full={this.state.r0full}
                            r0selected={this.state.r0selected}
                            animateTransition={this.state.animateTransition}
                            showConfBounds={this.state.showConfBounds}
                            confBoundsList={this.state.confBoundsList}
                            actualList={this.state.actualList}
                            showActual={this.state.showActual}
                            statThreshold={this.state.statThreshold}
                            dateThreshold={this.state.dateThreshold}
                            percExceedenceList={this.state.percExceedenceList}
                            dateRange={this.state.dateRange}
                            brushActive={this.state.brushActive}
                            scenarioClickCounter={this.state.scenarioClickCounter}
                            scenarioHovered={this.state.scenarioHovered}
                            statSliderActive={this.state.statSliderActive}
                            dateSliderActive={this.state.dateSliderActive}
                        /> 
                        <Brush
                            width={this.props.width}
                            height={80}
                            series={this.state.allDatesSeries}
                            dates={this.state.dates}
                            x={margin.yAxis}
                            y={0}
                            animateTransition={this.state.animateTransition}
                            toggleAnimateTransition={this.toggleAnimateTransition}
                            dateRange={this.state.dateRange}
                            dateThreshold={this.state.dateThreshold}
                            statThreshold={this.state.statThreshold}
                            onBrushChange={this.handleBrushRange}
                            onBrushStart={this.handleBrushStart}
                            onBrushEnd={this.handleBrushEnd}
                        />
                    </Col>

                    <Col className="gutter-row container mobile-only">
                        <div className="mobile-alert">
                            &#9888; The filters below are disabled on mobile devices.
                        </div>
                    </Col>

                    <Col className="gutter-row graph-filters mobile">
                        <Scenarios
                            view="graph"
                            SCENARIOS={this.state.SCENARIOS}
                            scenario={this.state.SCENARIOS[0]}
                            scenarioList={this.state.scenarioList}
                            onScenarioClick={this.handleScenarioClickGraph} />
                        <Indicators
                            stat={this.state.stat}
                            onIndicatorClick={this.handleIndicatorClick} />        
                        <SeverityContainer
                            stat={this.state.stat}
                            severityList={this.state.severityList}
                            scenarioList={this.state.scenarioList}
                            onSeveritiesClick={this.handleSeveritiesClick}
                            onSeveritiesHover={this.handleSeveritiesHover}
                            onSeveritiesHoverLeave={this.handleSeveritiesHoverLeave} />
                        <R0
                            r0full={this.state.r0full}
                            r0selected={this.state.r0selected}
                            onR0Change={this.handleR0Change}
                            onR0Resample={this.handleR0Resample}
                            allSims={this.state.allSims} 
                            selectedSims={this.state.seriesList[0]} />
                        <ActualSwitch
                            onChange={this.handleActualChange}
                            actualList={this.state.actualList} />
                        <ModeToggle
                            showConfBounds={this.state.showConfBounds}
                            onConfClick={this.handleConfClick} /> 
                        <Sliders 
                            stat={this.state.stat}
                            selectedDates={this.state.selectedDates}
                            seriesMax={this.state.seriesMax}
                            showConfBounds={this.state.showConfBounds}
                            statThreshold={this.state.statThreshold}
                            dateThreshold={this.state.dateThreshold}
                            dateThresholdIdx={this.state.dateThresholdIdx}
                            dateRange={this.state.dateRange}
                            onStatSliderChange={this.handleStatSliderChange}
                            onDateSliderChange={this.handleDateSliderChange}
                            onSliderMouseEvent={this.handleSliderMouseEvent} />
                    </Col>
                </Row>}
            </Content>
        )
    }
}

export default MainGraph;