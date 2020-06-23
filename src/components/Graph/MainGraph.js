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
import { buildScenarios, getStatThreshold, getDateThreshold, flagSimsOverThreshold, 
    getExceedences, flagSims, 
    getConfBounds, getActuals, filterByDate, filterR0 } from '../../utils/utils';
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
            allTimeSeries: {},
            dates: [],
            allTimeDates: [],
            stat: STATS[0],
            SCENARIOS: [],
            scenarioList: [],           
            severity: _.cloneDeep(LEVELS[0]), 
            severityList: [_.cloneDeep(LEVELS[0])],
            scenarioHovered: '',
            statThreshold: 0,
            statSliderActive: false,
            seriesMax: Number.NEGATIVE_INFINITY, // can you delete this
            seriesMin: Number.POSITIVE_INFINITY,
            dateThreshold: new Date(),
            dateRange: [parseDate('2020-03-01'), parseDate('2020-07-27')],
            showActual: false,
            actualList: [],
            r0: [0, 4],
            r0full: [0, 4],
            r0selected: [0, 4],
            r0resample: 0,   // counter for triggering componentDidUpdate
            simNum: '150',
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
        const { dataset } = this.props;
        const { severity, stat } = this.state;
        this.initializeGraph(dataset, stat, severity);
    };

    componentDidUpdate(prevProp) {
        const { dataset } = this.props;
        if (dataset !== prevProp.dataset) {
            this.initializeGraph(dataset, this.state.stat, this.state.severity)
        }
    };

    // initialize based on Dataset change
    initializeGraph(dataset, stat, severity) {
        // instantiate scenarios, dates, series, severities
        const { dateRange, severityList } = this.state

        // SCENARIOS: constant scenarios used for a given geoid
        const SCENARIOS = buildScenarios(dataset);  
        const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
        const series = dataset[SCENARIOS[0].key][severity.key][stat.key]
            .sims.slice(0, numDisplaySims);

        // allSims used for R0 histogram
        const allSims = dataset[SCENARIOS[0].key][severity.key][stat.key].sims;

        const idxMin = timeDay.count(dates[0], dateRange[0]);
        const idxMax = timeDay.count(dates[0], dateRange[1]);
        const [statThreshold, seriesMin, seriesMax] = getStatThreshold(
            [SCENARIOS[0]], [series], idxMin, idxMax);

        const sevList = _.cloneDeep(severityList);
        sevList[0].scenario = SCENARIOS[0].key;

        const simsOver = flagSims(
            series, statThreshold, dates, this.state.dateThreshold)        
        const newDates = Array.from(dates).slice(idxMin, idxMax);
        const filteredSeries = filterByDate(series, idxMin, idxMax)

        const confBoundsList = getConfBounds(
            dataset, [SCENARIOS[0]], severityList, stat, idxMin, idxMax)

        const actualList = getActuals(this.props.geoid, stat, [SCENARIOS[0]]);


        const r0array = dataset[SCENARIOS[0].key][severity.key][stat.key]
            .sims.map(sim => sim.r0);
        const r0full = [Math.min.apply(null, r0array), Math.max.apply(null, r0array)];

        const filteredR0SeriesList = filterR0(
            r0full, [SCENARIOS[0]], sevList, stat, dataset, numDisplaySims);

        this.setState({
            SCENARIOS,
            scenarioList: [SCENARIOS[0]],
            dates: newDates,
            allTimeDates: Array.from(dates),        // dates for brush
            allTimeSeries: Array.from(series),      // series for brush
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
            r0selected: r0full, // alternative r0 streategy: [2.2, 2.4]
            filteredR0SeriesList // TODO: you have got to fix this / change the name
        }, () => {
            this.setState({dataLoaded: true});
        })
    }

    // initialize based on Scenario, Stat, Severity, R0 change
    initialize = (seriesList, scenarioList, stat, severityList, dateRange) => {
        const { dataset, geoid } = this.props;
        const { allTimeDates } = this.state;
        
        const idxMin = timeDay.count(allTimeDates[0], dateRange[0]);
        const idxMax = timeDay.count(allTimeDates[0], dateRange[1]);

        const dateThreshold = getDateThreshold(allTimeDates, idxMin, idxMax);

        const [statThreshold, seriesMin, seriesMax] = getStatThreshold(
            scenarioList, seriesList, idxMin, idxMax);

        const [flaggedSeriesList, simsOverList] = flagSimsOverThreshold(
            scenarioList, seriesList, allTimeDates, idxMin, idxMax, statThreshold, dateThreshold)

        const percExceedenceList = getExceedences(
            scenarioList, seriesList, simsOverList);

        const confBoundsList = getConfBounds(
            dataset, scenarioList, severityList, stat, idxMin, idxMax)

        const actualList = getActuals(geoid, stat, scenarioList);

        this.setState({
            seriesList: flaggedSeriesList,
            // for simplicity, brush will just use first series
            allTimeSeries: seriesList[0],  
            statThreshold,
            dateThreshold,
            seriesMin,
            seriesMax,
            percExceedenceList,
            confBoundsList,
            actualList,
            animateTransition: true
        })
    }

    handleIndicatorClick = (stat) => {
        const { dataset } = this.props;
        const { scenarioList, severityList, r0selected, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);

        this.setState({stat, filteredR0SeriesList: seriesList})
        this.initialize(seriesList, scenarioList, stat, severityList, dateRange);
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
            filteredR0SeriesList: seriesList
        })      
        this.initialize(seriesList, scenarioList, stat, severityList, dateRange); 
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
            filteredR0SeriesList: seriesList,
            animateTransition: true
        });
        this.initialize(seriesList, scenarioList, stat, severityList, dateRange); 
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
            filteredR0SeriesList: seriesList
        })
        this.initialize(seriesList, scenarioList, stat, severityList, dateRange);     
    };

    handleR0Resample = () => {
        const { dataset } = this.props;
        const { scenarioList, severityList, stat, r0selected, dateRange } = this.state;

        const seriesList = filterR0(
            r0selected, scenarioList, severityList, stat, dataset, numDisplaySims);
        
        this.setState({
            r0selected,
            filteredR0SeriesList: seriesList
        })
        this.initialize(seriesList, scenarioList, stat, severityList, dateRange);     
    };

    handleActualChange = () => {
        this.setState({showActual: !this.state.showActual}); 
    };

    handleStatSliderChange = (thresh) => {
        console.log('handleStatSliderChange')
        const { dates, dateThreshold, allTimeDates } = this.state;
        // const rounded = Math.ceil(i / 100) * 100;
        const copyList = Array.from(this.state.seriesList);
        const allSeriesCopy = Array.from(this.state.allTimeSeries);
        // TODO: why is this called twice?
        flagSims(allSeriesCopy, thresh, allTimeDates, dateThreshold);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = flagSims(copyList[i], thresh, dates, dateThreshold);
            const percExceedence = simsOver / copyList[i].length;
            percExceedenceList.push(percExceedence);
        }
        this.setState({
            seriesList: copyList,
            allTimeSeries: allSeriesCopy,
            statThreshold: +thresh,
            percExceedenceList,
            animateTransition: false
        });
    };

    handleDateSliderChange = (thresh) => {
        console.log('handleDateSliderChange')
        const { statThreshold, dates, allTimeDates } = this.state;
        const copyList = Array.from(this.state.seriesList);
        const allSeriesCopy = Array.from(this.state.allTimeSeries);
        flagSims(allSeriesCopy, statThreshold, allTimeDates, thresh);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = flagSims(copyList[i], statThreshold, dates, thresh);
            const percExceedence = simsOver / copyList[i].length;
            percExceedenceList.push(percExceedence);
        }
        this.setState({
            seriesList: copyList,
            allTimeSeries: allSeriesCopy,
            dateThreshold: thresh,
            percExceedenceList,
            animateTransition: false
        })
    }

    handleBrushRange = (dateRange) => {
        const { filteredR0SeriesList, scenarioList, stat, severityList } = this.state;

        this.setState({
            dateRange, 
            animateTransition: false
        });
        this.initialize(filteredR0SeriesList, scenarioList, stat, severityList, dateRange);
    };

    handleBrushStart = () => {this.setState({brushActive: true, animateTransition: false})}

    handleBrushEnd = () => {this.setState({brushActive: false, animateTransition: true})}

    handleConfClick = () => {
        console.log('handleConfBoundClick')
        this.setState(prevState => ({showConfBounds: !prevState.showConfBounds, animateTransition: false}));
    };

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

    toggleAnimateTransition = () => {
        this.setState({ animateTransition: !this.state.animateTransition })
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
                            dates={this.state.dates}
                            scenarioList={this.state.scenarioList}
                            seriesList={this.state.seriesList}
                            stat={this.state.stat}
                            severity={this.state.severity}
                            r0full={this.state.r0full}
                            r0selected={this.state.r0selected}
                            animateTransition={this.state.animateTransition}
                            toggleAnimateTransition={this.toggleAnimateTransition}
                            simNum={this.state.simNum}
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
                            series={this.state.allTimeSeries}
                            dates={this.state.allTimeDates}
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
                            dates={this.state.dates}
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