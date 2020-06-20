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
import { buildScenarios, returnSimsOverThreshold, filterR0, getRange } from '../../utils/utils';
import { utcParse, } from 'd3-time-format';
import { timeDay } from 'd3-time';
import { max } from 'd3-array';

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
            seriesMax: Number.NEGATIVE_INFINITY,
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

    componentDidUpdate(prevProp, prevState) {
        console.log('componentDidUpdate')
        const { dataset } = this.props;
        if (dataset !== prevProp.dataset) {
            this.initializeGraph(dataset, this.state.stat, this.state.severity)
        }

        // if (this.state.stat !== prevState.stat ||
        //     this.state.scenarioList !== prevState.scenarioList ||
        //     this.state.severityList !== prevState.severityList) {
        //         // In these update loops we want to reset the R0 to the full range
        //         // and randomly resample??
        //     }

        // changes for the props below are all interdependent and require both 
        // r0 filtering and returnSimsOverThreshold for which sims are above/below threshold
        if (this.state.stat !== prevState.stat) console.log('stat diff', prevState.stat, this.state.stat)
        if (this.state.scenarioList !== prevState.scenarioList) console.log('scenarioList diff', prevState.scenarioList, this.state.scenarioList)
        if (this.state.severityList !== prevState.severityList) console.log('severityList diff', prevState.severityList, this.state.severityList)
        if (this.state.dateRange !== prevState.dateRange) console.log('dateRange diff', prevState.dateRange, this.state.dateRange)
        // if (this.state.seriesList !== prevState.seriesList) console.log('seriesList diff', prevState.seriesList, this.state.seriesList)
        if (this.state.r0selected !== prevState.r0selected) console.log('r0selected diff', prevState.r0selected, this.state.r0selected)
        if (this.state.r0resample !== prevState.r0resample) console.log('r0resample diff', prevState.r0resample, this.state.r0resample)

        if (
            this.state.stat !== prevState.stat ||
            this.state.scenarioList !== prevState.scenarioList ||
            this.state.severityList !== prevState.severityList ||
            this.state.dateRange !== prevState.dateRange ||
            this.state.r0selected !== prevState.r0selected ||
            this.state.r0resample !== prevState.r0resample) {
                console.log('IN MAIN UPDATE LOOP')

            const filteredSeriesList = []
            const percExceedenceList = []
            const confBoundsList = [];
            const actualList = [];
            let brushSeries;
            
            const { dataset } = this.props;
            const { stat, severityList, scenarioList, r0FilteredSeriesList, allTimeDates, dateRange, r0selected } = this.state;

            // filter series and dates by dateRange
            const idxMin = timeDay.count(allTimeDates[0], dateRange[0]);
            const idxMax = timeDay.count(allTimeDates[0], dateRange[1]);
            const filteredDates = Array.from(allTimeDates.slice(idxMin, idxMax));
            const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
            const dateThreshold = filteredDates[dateThresholdIdx];
            let statThreshold = 0
            let sliderMin = Number.POSITIVE_INFINITY
            let sliderMax = 0

            for (let i = 0; i < scenarioList.length; i++) {
                let series
                if (this.state.stat !== prevState.stat ||
                    this.state.scenarioList !== prevState.scenarioList ||
                    this.state.severityList !== prevState.severityList) {
                        
                        const copy = Array.from(
                            dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);
                        series = filterR0(copy, r0selected, numDisplaySims);
                    } else {
                        // deal with daterange and r0 slider / sample
                        series = r0FilteredSeriesList[i]
                        console.log('r0FilteredSeries', series)
                    }
                
                // setting default smart threshold based on seriesMin 
                const filteredSeriesForStatThreshold = series.map( s => {
                    const newS = {...s}
                    newS.vals = s.vals.slice(idxMin, idxMax)
                    return newS
                });
                console.log(filteredSeriesForStatThreshold)
                // array of all peaks in filtered series
                const seriesPeaks = filteredSeriesForStatThreshold.map(sim => max(sim.vals));
                console.log('seriesPeaks', seriesPeaks)
                const [seriesMin, seriesMax] = getRange(seriesPeaks);
                console.log('seriesMin', seriesMin, 'seriesMax', seriesMax)
                // ensures side by side y-scale reflect both series
                if (seriesMin < sliderMin) sliderMin = seriesMin
                if (seriesMax > sliderMax) sliderMax = seriesMax

                // sets default smart value for statThreshold calculation
                if (i === 0 && seriesMin < seriesMax/2) statThreshold = seriesMin;
                if (i === 0 && seriesMin >= seriesMax/2) statThreshold = seriesMax/2;
                const simsOver = returnSimsOverThreshold(
                    series, statThreshold, allTimeDates, dateThreshold);

                // brush visual only based on first scenario, for simplicity
                if (i === 0) brushSeries = series

                // filtering based on date, only dateRange change needs this 
                const filteredSeries = series.map( s => { const newS = {...s}
                    newS.vals = s.vals.slice(idxMin, idxMax)
                    return newS
                })
                filteredSeriesList.push(filteredSeries)

                // calculate percExceedence based on series after filtering down
                const percExceedence = filteredSeries.length > 0 ?
                    simsOver / filteredSeries.length : 0;
                percExceedenceList.push(percExceedence)

                const confBounds = dataset[scenarioList[i].key][severityList[i].key][stat.key].conf;
                // ensure stat has confidence bounds array
                if (confBounds && confBounds.length > 0) {
                    // filter by date range selected
                    const filteredConfBounds = confBounds.slice(idxMin, idxMax)
                    confBoundsList.push(filteredConfBounds);
                }
                // instantiate actuals data if data for specific indicator exists
                let actual = [];
                const indicator = stat.name.toLowerCase();
                const actualJSON = require('../../store/actuals.json');
                if (Object.keys(actualJSON).includes(indicator)) {
                    actual = actualJSON[indicator][this.props.geoid].map( d => {
                        return { date: parseDate(d.date), val: d.val}
                    });
                }
                actualList.push(actual);
            }
            this.setState({
                seriesList: filteredSeriesList,
                allTimeSeries: brushSeries,
                dates: filteredDates,
                statThreshold,
                dateThreshold,
                seriesMin: sliderMin,
                seriesMax: sliderMax,
                percExceedenceList,
                confBoundsList,
                actualList,
                // showActual: false
            })
        }
    };

    initializeGraph(dataset, stat, severity) {
        // instantiate scenarios, dates, series, severities
        const SCENARIOS = buildScenarios(dataset);  
        const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
        const series = dataset[SCENARIOS[0].key][severity.key][stat.key]
            .sims.slice(0, numDisplaySims);
        const seriesPeaks = series.map(sim => sim.max);
        const [seriesMin, seriesMax] = getRange(seriesPeaks);
        const statThreshold = Math.ceil((seriesMax / 1.4) / 100) * 100;
        const sevList = _.cloneDeep(this.state.severityList);
        sevList[0].scenario = SCENARIOS[0].key;

        // iterate through SeriesList
        const simsOver = returnSimsOverThreshold(
            series, statThreshold, dates, this.state.dateThreshold)        
        const percExceedence = simsOver / series.length;

        // send sims to brush after it's been colored, update brush-selected dates
        const allTimeSeries = Array.from(series)
        const allTimeDates = Array.from(dates) 
        const idxMin = timeDay.count(dates[0], this.state.dateRange[0]);
        const idxMax = timeDay.count(dates[0], this.state.dateRange[1]);
        const newDates = Array.from(allTimeDates.slice(idxMin, idxMax));
        const filteredSeries = series.map( s => {
            const newS = {...s}
            newS.vals = s.vals.slice(idxMin, idxMax)
            return newS
        })
        // instantiate confidence bounds
        const confBounds = dataset[SCENARIOS[0].key][severity.key][stat.key].conf;
        const filteredConfBounds = confBounds.slice(idxMin, idxMax)

        // instantiate actuals data if data for specific indicator exists
        let actual = [];
        const indicator = stat.name.toLowerCase();
        const actualJSON = require('../../store/actuals.json');
        if (Object.keys(actualJSON).includes(indicator)) {
            actual = actualJSON[indicator][this.props.geoid];
        }

        // instantiate min and max of r0 based on dataset
        const r0array = dataset[SCENARIOS[0].key][severity.key][stat.key]
            .sims.map(sim => sim.r0);
        const r0full = [Math.min.apply(null, r0array), Math.max.apply(null, r0array)];

        this.setState({
            SCENARIOS,
            scenarioList: [SCENARIOS[0]],
            dates: newDates,
            allTimeDates,
            seriesList: [filteredSeries],
            severityList: sevList,
            allTimeSeries,
            seriesMax,
            seriesMin,
            statThreshold,
            percExceedenceList: [percExceedence],
            confBoundsList: [filteredConfBounds],
            showConfBounds: false,
            actualList: [actual],
            r0: [0, 4],
            r0full,
            r0selected: r0full // alternative r0 streategy: [2.2, 2.4]
        }, () => {
            this.setState({dataLoaded: true});
        })
    }

    handleIndicatorClick = (i) => {
        const yAxisLabel = `Daily ${i.name}`;
        this.setState({
            stat: i, 
            yAxisLabel,
        })
    };

    handleScenarioClickGraph = (items) => {
        // items is Array of scenario names
        const scenarioClkCntr = this.state.scenarioClickCounter + 1;
        let newScenarios = [];
        let newSevs = [];

        for (let item of items) {
            const defaultSev = _.cloneDeep(LEVELS[0]); 
            defaultSev.scenario = item;
            newSevs.push(defaultSev)

            const scenario = this.state.SCENARIOS.filter(s => s.key === item)[0];
            newScenarios.push(scenario);
        }

        this.setState({
            scenarioList: newScenarios,
            scenarioClickCounter: scenarioClkCntr,
            severityList: newSevs, 
        })        
    };

    handleSeveritiesClick = (i) => {
        let newSevList = _.cloneDeep(this.state.severityList);
        newSevList.forEach(sev => {
            if (sev.scenario === i.scenario) {
                return sev.key = i.key;
            }
        })
        this.setState({
            severityList: newSevList, 
            animateTransition: true
        });
    };

    handleSeveritiesHover = (i) => {this.setState({scenarioHovered: i})};

    handleSeveritiesHoverLeave = () => {this.setState({scenarioHovered: ''});}

    handleR0Change = (e) => {
        console.log('handleR0Change')
        const r0selected = e
        const { dataset } = this.props;
        const { scenarioList, severityList, stat } = this.state;
        const r0FilteredSeriesList = []
        for (let i = 0; i < scenarioList.length; i++) {
            const copy = Array.from(
                dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);
            const r0FilteredSeries = filterR0(copy, r0selected, numDisplaySims);
            r0FilteredSeriesList.push(r0FilteredSeries)
        }

        this.setState({ r0selected, animateTransition: true, r0FilteredSeriesList })
    };

    handleR0Resample = () => {
        console.log('handleR0Resample')
        const { dataset } = this.props;
        const { scenarioList, severityList, stat, r0selected } = this.state;
        const r0FilteredSeriesList = []
        for (let i = 0; i < scenarioList.length; i++) {
            const copy = Array.from(
                dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);
            const r0FilteredSeries = filterR0(copy, r0selected, numDisplaySims);
            r0FilteredSeriesList.push(r0FilteredSeries)
        }

        this.setState(prevState => {
            return { r0resample: prevState.r0resample + 1, r0FilteredSeriesList }
        })
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
        returnSimsOverThreshold(allSeriesCopy, thresh, allTimeDates, dateThreshold);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = returnSimsOverThreshold(copyList[i], thresh, dates, dateThreshold);
            const percExceedence = simsOver / copyList[i].length;
            percExceedenceList.push(percExceedence);
        }
        this.setState({
            seriesList: copyList,
            allTimeSeries: allSeriesCopy,
            statThreshold: +thresh,
            percExceedenceList,
            animateTransition: true
        });
    };

    handleDateSliderChange = (thresh) => {
        console.log('handleDateSliderChange')
        const { statThreshold, dates, allTimeDates } = this.state;
        const copyList = Array.from(this.state.seriesList);
        const allSeriesCopy = Array.from(this.state.allTimeSeries);
        returnSimsOverThreshold(allSeriesCopy, statThreshold, allTimeDates, thresh);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = returnSimsOverThreshold(copyList[i], statThreshold, dates, thresh);
            const percExceedence = simsOver / copyList[i].length;
            percExceedenceList.push(percExceedence);
        }
        this.setState({
            seriesList: copyList,
            allTimeSeries: allSeriesCopy,
            dateThreshold: thresh,
            percExceedenceList
        })
    }

    handleBrushRange = (i) => {this.setState({dateRange: i, animateTransition: false});};

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

                    <Col className="gutter-row filters mobile">
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
                            onR0Resample={this.handleR0Resample} />
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