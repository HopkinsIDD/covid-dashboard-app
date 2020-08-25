import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import _ from 'lodash';
import GraphContainer from './GraphContainer';
import Brush from '../Filters/Brush';
import Scenarios from '../Filters/Scenarios.tsx';
import Indicators from '../Filters/Indicators.tsx';
import SeverityContainer from '../Filters/SeverityContainer.tsx'
import ActualSwitch from '../Filters/ActualSwitch.tsx';
import R0 from '../Filters/R0';
import ModeToggle from '../Filters/ModeToggle.tsx';
import Sliders from '../Filters/Sliders';

import { buildScenarios, buildScenarioMap, buildSeverities, getR0range, 
    getConfBounds, getActuals, filterR0 } from '../../utils/utils';
import { getindicatorThreshold, getDateThreshold, flagSimsOverThreshold, 
    getExceedences, flagSims, filterByDate } from '../../utils/threshold';
import { styles, margin, dimMultipliers, numDisplaySims, LEVELS } from '../../utils/constants';
import { utcParse, utcFormat } from 'd3-time-format';
import { timeDay } from 'd3-time';

const parseDate = utcParse('%Y-%m-%d');
const formatDate = utcFormat('%Y-%m-%d');
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
            indicator: {},
            SCENARIOS: [],
            scenarioList: [],         // TODO: can scenarioList be removed now that scenarioMap exists?
            scenarioMap: {},          // map of scenario to list of severities   
            severity: _.cloneDeep(LEVELS[0]), 
            severityList: [_.cloneDeep(LEVELS[0])],
            scenarioHovered: '',
            indicatorThreshold: 0,
            statSliderActive: false,
            seriesMax: Number.NEGATIVE_INFINITY, 
            seriesMin: Number.POSITIVE_INFINITY,
            showActual: false,
            actualList: [],
            r0full: [0, 4],               // full range of r0
            r0selected: [0, 4],           // used selected range of r0
            seriesListForBrush: [],       // used by Brush in handler
            percExceedenceList: [],
            confBounds: {},
            showConfBounds: true,
            confBoundsList: [],
            brushActive: false,
            animateTransition: true,
            scenarioClickCounter: 0,
        };
    };

    componentDidMount() {
        this.initialize(this.props.dataset);
    };

    componentDidUpdate(prevProp) {
        if (this.props.dataset !== prevProp.dataset) {
            this.initialize(this.props.dataset)
        }
    };

    initialize = (dataset) => {
        // initialize() trigged on mount and Dataset change

        const { indicators, actuals } = this.props;

        // SCENARIOS: various scenario variables used for a given geoid
        const SCENARIOS = buildScenarios(dataset);  
        const scenarioMap = buildScenarioMap(dataset);
        const firstScenario = SCENARIOS[0];
        const firstIndicator = indicators[0];
        const firstSeverity = scenarioMap[firstScenario.key][0];
        // '2020-07-19-21-44-47-inference'
        const dateString = firstScenario.key.substring(0,10)
        const dateThreshold = parseDate(dateString)

        // firstSeverity need to be designated in case not all death rate LEVELS exist
        const dates = dataset[firstScenario.key].dates.map( d => parseDate(d));
        const series = dataset[firstScenario.key][firstSeverity][firstIndicator.key]
            .slice(0, numDisplaySims);
        const severityList = buildSeverities(scenarioMap, [], firstScenario.key);
        const sevList = _.cloneDeep(severityList);
        sevList[0].scenario = firstScenario.key;

        // allSims used for R0 histogram
        const allSims = dataset[firstScenario.key][firstSeverity][firstIndicator.key];

        // set dateRange to a default based on equal padding around date of scenario run
        const currIdx = dates.findIndex(date => formatDate(date) === formatDate(dateThreshold))
        const datePadding = dates.length - currIdx
        const startIdx = dates.length - 1 - (datePadding * 2)
        
        // have a multiple of ten pad each side of the dateRange - alternative way
        // const numDates = dates.length
        // const dateMargin =  Math.ceil(Math.ceil(numDates / 10) / 10) * 10
        const dateRange = [dates[startIdx], dates[dates.length - 1]]

        // initialize Threshold and slider ranges
        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);
        const [indicatorThreshold, seriesMin, seriesMax] = getindicatorThreshold(
            [firstScenario], [series], idxMin, idxMax);
        const simsOver = flagSims(
            series, indicatorThreshold, dates, dateThreshold)        
        const newSelectedDates = Array.from(dates).slice(idxMin, idxMax);
        const filteredSeries = filterByDate(series, idxMin, idxMax)

        const confBoundsList = getConfBounds(
            dataset, [firstScenario], severityList, firstIndicator, dates, idxMin, idxMax)

        const actualList = getActuals(actuals, firstIndicator, [firstScenario]);

        const r0full = getR0range(dataset, firstScenario, sevList[0], firstIndicator);
        // seriesListForBrush used by handleBrush to initialize instead of R0 filtering 
        // series is updated and set to state in scenario, sev, indicator, r0 change handlers
        const seriesListForBrush = filterR0(
            r0full, [firstScenario], sevList, firstIndicator, dataset, numDisplaySims);

        this.setState({
            SCENARIOS,
            scenarioList: [firstScenario],
            scenarioMap,
            indicator: indicators[0],
            selectedDates: newSelectedDates,
            dateRange,
            dateThreshold,
            runDate: dateThreshold,
            dates: Array.from(dates),                  // dates for brush
            allDatesSeries: Array.from(series),        // series for brush
            allSims,
            seriesList: [filteredSeries],
            severityList: sevList,
            severity: firstSeverity,
            seriesMax,
            seriesMin,
            indicatorThreshold,
            percExceedenceList: [simsOver / series.length],
            confBoundsList,
            showConfBounds: true,
            actualList,
            showActual: false,
            r0full,
            r0selected: r0full, 
            seriesListForBrush 
        }, () => {
            this.setState({dataLoaded: true});
        });
    }

    update = (seriesList, scenarioList, indicator, severityList, dateRange) => {
        // update() triggered on Scenario, Indicator, Severity, R0, Brush change
        const { dataset, actuals } = this.props;
        const { dates } = this.state;

        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);

        const newSelectedDates = Array.from(dates).slice(idxMin, idxMax);

        const dateThreshold = getDateThreshold(dates, idxMin, idxMax);
        const [indicatorThreshold, seriesMin, seriesMax] = getindicatorThreshold(
            scenarioList, seriesList, idxMin, idxMax);

        const [flaggedSeriesList, simsOverList] = flagSimsOverThreshold(
            scenarioList, seriesList, dates, idxMin, idxMax, 
            indicatorThreshold, dateThreshold)

        const percExceedenceList = getExceedences(
            scenarioList, seriesList, simsOverList);

        const confBoundsList = getConfBounds(
            dataset, scenarioList, severityList, indicator, dates, idxMin, idxMax)
        const actualList = getActuals(actuals, indicator, scenarioList);

        this.setState({
            seriesList: flaggedSeriesList,
            allDatesSeries: seriesList[0],  // brush uses first series
            selectedDates: newSelectedDates,
            indicatorThreshold,
            dateThreshold,
            seriesMin,
            seriesMax,
            percExceedenceList,
            confBoundsList,
            actualList
        })
    }

    handleIndicatorClick = (indicator) => {
        const { dataset } = this.props;
        const { scenarioList, severityList, r0selected, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, indicator, dataset, numDisplaySims);

        this.setState({indicator, seriesListForBrush: seriesList, animateTransition: true})
        this.update(seriesList, scenarioList, indicator, severityList, dateRange);
    };

    handleScenarioClickGraph = (scenarios) => {
        const { dataset } = this.props;
        const { indicator, r0selected, dateRange, scenarioMap } = this.state;

        const scenarioClkCntr = this.state.scenarioClickCounter + 1;
        let scenarioList = [];
        let severityList = [];

        // associate each severity with a scenario to enable hover over severity label
        for (let scenObj of scenarios) {
            const scenario = this.state.SCENARIOS.filter(s => s.key === scenObj)[0];
            scenarioList.push(scenario);

            severityList = buildSeverities(scenarioMap, severityList, scenObj);
        }

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, indicator, dataset, numDisplaySims);
        
        this.setState({
            scenarioList,
            scenarioClickCounter: scenarioClkCntr,
            severityList,
            seriesListForBrush: seriesList,
            animateTransition: true
        })      
        this.update(seriesList, scenarioList, indicator, severityList, dateRange); 
    };

    handleSeveritiesClick = (i) => {
        const { dataset } = this.props;
        const { scenarioList, indicator, r0selected, dateRange } = this.state;

        let severityList = _.cloneDeep(this.state.severityList);
        severityList.forEach(sev => {
            if (sev.scenario === i.scenario) {
                return sev.key = i.key;
            }
        })
        const seriesList = filterR0(
            r0selected, scenarioList, severityList, indicator, dataset, numDisplaySims);
        
        this.setState({
            severityList, 
            seriesListForBrush: seriesList,
            animateTransition: true
        });
        this.update(seriesList, scenarioList, indicator, severityList, dateRange); 
    };

    handleSeveritiesHover = (i) => {this.setState({scenarioHovered: i})};

    handleSeveritiesHoverLeave = () => {this.setState({scenarioHovered: ''});}

    handleR0Change = (r0selected) => {
        const { dataset } = this.props;
        const { scenarioList, severityList, indicator, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, indicator, dataset, numDisplaySims);
        
        this.setState({
            r0selected,
            seriesListForBrush: seriesList,
            animateTransition: true
        })
        this.update(seriesList, scenarioList, indicator, severityList, dateRange);     
    };

    handleR0Resample = () => {
        const { dataset } = this.props;
        const { scenarioList, severityList, indicator, r0selected, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, indicator, dataset, numDisplaySims);
        
        this.setState({
            r0selected,
            seriesListForBrush: seriesList,
            animateTransition: true
        })
        this.update(seriesList, scenarioList, indicator, severityList, dateRange);     
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
            indicatorThreshold: +thresh,
            percExceedenceList,
            animateTransition: false
        });
    };

    handleDateSliderChange = (thresh) => {
        const { indicatorThreshold, selectedDates, dates } = this.state;
        const seriesList = Array.from(this.state.seriesList);
        const allDatesSeries = Array.from(this.state.allDatesSeries);
        // flag Sims for Brush
        flagSims(allDatesSeries, indicatorThreshold, dates, thresh);
        const percExceedenceList = [];
        // flag Sims for seriesList
        for (let i = 0; i < seriesList.length; i++) {
            const simsOver = flagSims(seriesList[i], indicatorThreshold, selectedDates, thresh);
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
        const { seriesListForBrush, scenarioList, indicator, severityList } = this.state;
        this.setState({
            dateRange, 
            animateTransition: false
        });
        this.update(seriesListForBrush, scenarioList, indicator, severityList, dateRange);
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
        const { scenarioList, severityList, indicator, dates, dateRange } = this.state;

        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);

        const confBoundsList = getConfBounds(
            dataset, scenarioList, severityList, indicator, dates, idxMin, idxMax);

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
            if (slider === 'indicator') {
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
                            indicator={this.state.indicator}
                            severity={this.state.severity}
                            r0full={this.state.r0full}
                            r0selected={this.state.r0selected}
                            animateTransition={this.state.animateTransition}
                            showConfBounds={this.state.showConfBounds}
                            confBoundsList={this.state.confBoundsList}
                            actualList={this.state.actualList}
                            showActual={this.state.showActual}
                            indicatorThreshold={this.state.indicatorThreshold}
                            dateThreshold={this.state.dateThreshold}
                            runDate={this.state.runDate}
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
                            x={margin.yAxis + (this.props.width * dimMultipliers.brushOffset)}
                            y={0}
                            animateTransition={this.state.animateTransition}
                            toggleAnimateTransition={this.toggleAnimateTransition}
                            dateRange={this.state.dateRange}
                            dateThreshold={this.state.dateThreshold}
                            indicatorThreshold={this.state.indicatorThreshold}
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
                            indicator={this.state.indicator}  // TODO: remove this
                            indicators={this.props.indicators}
                            onIndicatorClick={this.handleIndicatorClick} />        
                        <SeverityContainer
                            indicator={this.state.indicator}
                            severityList={this.state.severityList}
                            scenarioList={this.state.scenarioList} 
                            scenarioMap={this.state.scenarioMap}
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
                            showActual={this.state.showActual}
                            actualList={this.state.actualList} />
                        <ModeToggle
                            showConfBounds={this.state.showConfBounds}
                            onConfClick={this.handleConfClick} /> 
                        <Sliders 
                            indicator={this.state.indicator}
                            selectedDates={this.state.selectedDates}
                            seriesMax={this.state.seriesMax}
                            showConfBounds={this.state.showConfBounds}
                            indicatorThreshold={this.state.indicatorThreshold}
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