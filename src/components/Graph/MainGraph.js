import React, { Component, Fragment } from 'react';
import { Layout, Row, Col } from 'antd';
import _ from 'lodash';
import GraphContainer from './GraphContainer';
import Brush from '../Filters/Brush';
import Scenarios from '../Filters/Scenarios';
import Indicators from '../Filters/Indicators';
import Switch from '../Filters/Switch';
import R0 from '../Filters/R0';
import SeverityContainer from '../Filters/SeverityContainer'
import Sliders from '../Filters/Sliders';

import { styles, margin, STATS, LEVELS, COUNTYNAMES } from '../../utils/constants';
import { buildScenarios, getRange } from '../../utils/utils';
import { utcParse, timeFormat } from 'd3-time-format';
import { timeDay } from 'd3-time'

const parseDate = utcParse('%Y-%m-%d');
const formatDate = timeFormat('%Y-%m-%d');

class MainGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            series: {},
            seriesList: [{}],
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
            dateRange: [parseDate('2020-03-01'), parseDate('2020-09-01')],
            r0: [0, 4],
            simNum: '150',
            percExceedenceList: [],
            showConfBounds: false,
            confBounds: {},
            confBoundsList: [{}],
            brushActive: false,
            animateTransition: true,
            scenarioClickCounter: 0,
        };
    };

    componentDidMount() {
        const { dataset } = this.props;
        const { severity, stat } = this.state;

        // instantiate scenarios, dates, series, severities
        const SCENARIOS = buildScenarios(dataset);  
        const dates = dataset[SCENARIOS[0].key].dates.map( d => parseDate(d));
        const series = dataset[SCENARIOS[0].key][severity.key][stat.key].sims;
        const seriesPeaks = series.map(sim => sim.max);
        const [seriesMin, seriesMax] = getRange(seriesPeaks);
        const statThreshold = Math.ceil((seriesMax / 1.4) / 100) * 100;
        const sevList = _.cloneDeep(this.state.severityList);
        sevList[0].scenario = SCENARIOS[0].key;

        // iterate through SeriesList
        const simsOver = this.updateThresholdIterate(
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
        }, () => {
            this.setState({dataLoaded: true});
        })
    };


    componentDidUpdate(prevProp, prevState) {
        // TODO: should component Update?
        // TODO: r0 should be reset to [0, 4] when stat, scenario, severity, etc change
        // but you cannot add it here or you'll get stackOverflow
        if (
            this.state.stat !== prevState.stat ||
            this.state.scenarioList !== prevState.scenarioList ||
            this.state.severityList !== prevState.severityList ||
            this.state.dateRange !== prevState.dateRange ||
            this.state.r0 !== prevState.r0 ||
            this.props.dataset !== prevProp.dataset) {

            const filteredSeriesList = []
            const percExceedenceList = []
            const confBoundsList = [];
            let brushSeries
            
            const { dataset } = this.props;
            const { stat, severityList, scenarioList, r0 } = this.state;
            // filter series and dates by dateRange
            const idxMin = timeDay.count(this.state.dates[0], this.state.dateRange[0]);
            const idxMax = timeDay.count(this.state.dates[0], this.state.dateRange[1]);
            const filteredDates = Array.from(this.state.allTimeDates.slice(idxMin, idxMax));
            const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
            const dateThreshold = filteredDates[dateThresholdIdx]
            let statThreshold = 0
            let sliderMin = 100000000000
            let sliderMax = 0

            for (let i = 0; i < scenarioList.length; i++) {
                const copy = Array.from(
                    dataset[scenarioList[i].key][severityList[i].key][stat.key].sims);

                // filter down sims on reproductive number
                const newSeries = copy.filter(s => { return (s.r0 > r0[0] && s.r0 < r0[1]) });
                    
                const filteredSeriesForStatThreshold = newSeries.map( s => {
                    const newS = {...s}
                    newS.vals = s.vals.slice(idxMin, idxMax)
                    return newS
                });
                const seriesPeaks = filteredSeriesForStatThreshold.map(sim => sim.max);
                const [seriesMin, seriesMax] = getRange(seriesPeaks);
                if (seriesMin < sliderMin) sliderMin = seriesMin
                if (seriesMax > sliderMax) sliderMax = seriesMax
                if (i === 0) statThreshold = Math.ceil(seriesMax / 1.2);

                const simsOver = this.updateThresholdIterate(
                    newSeries, statThreshold, this.state.allTimeDates, dateThreshold);
                if (i === 0) brushSeries = newSeries

                const percExceedence = simsOver / newSeries.length;
                percExceedenceList.push(percExceedence)

                const filteredSeries = newSeries.map( s => { const newS = {...s}
                    newS.vals = s.vals.slice(idxMin, idxMax)
                    return newS
                })
                filteredSeriesList.push(filteredSeries)
                
                const confBounds = dataset[scenarioList[i].key][severityList[i].key][stat.key].conf;
                // ensure stat has confidence bounds array
                if (confBounds && confBounds.length > 0) {
                    // filter by date range selected
                    const filteredConfBounds = confBounds.slice(idxMin, idxMax)
                    confBoundsList.push(filteredConfBounds);
                }
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
                confBoundsList
            })
        }
    };

    updateThresholdIterate = (series, statThreshold, dates, dateThreshold) => {
        const dateIndex = dates.findIndex(
            date => formatDate(date) === formatDate(dateThreshold)
            );
        let simsOver = 0;
        Object.values(series).forEach((sim, simIdx) => {
            let simOver = false;
            for (let i = 0; i < dateIndex; i++) {
                if (sim.vals[i] > statThreshold){
                    simsOver = simsOver + 1;
                    simOver = true;
                    break;
                }
            }
            simOver ? sim.over = true : sim.over = false
        })
        return simsOver;
    }

    handleButtonClick = (i) => {
        const yAxisLabel = `Daily ${i.name}`;
        this.setState({
            stat: i, 
            yAxisLabel,
            r0: [0, 4]
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
            r0: [0, 4]
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
            r0: [0, 4],
            animateTransition: true
        });
    };

    handleSeveritiesHover = (i) => {this.setState({scenarioHovered: i})};

    handleSeveritiesHoverLeave = () => {this.setState({scenarioHovered: ''});}

    handleR0Change = (e) => {
        this.setState({ r0: e, animateTransition: false })
    };

    handleStatSliderChange = (thresh) => {
        const { dates, dateThreshold, allTimeDates } = this.state;
        // const rounded = Math.ceil(i / 100) * 100;
        const copyList = Array.from(this.state.seriesList);
        const allSeriesCopy = Array.from(this.state.allTimeSeries);
        this.updateThresholdIterate(allSeriesCopy, thresh, allTimeDates, dateThreshold);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = this.updateThresholdIterate(copyList[i], thresh, dates, dateThreshold);
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
        const { statThreshold, dates, allTimeDates } = this.state;
        const copyList = Array.from(this.state.seriesList);
        const allSeriesCopy = Array.from(this.state.allTimeSeries);
        this.updateThresholdIterate(allSeriesCopy, statThreshold, allTimeDates, thresh);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = this.updateThresholdIterate(copyList[i], statThreshold, dates, thresh);
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
        this.setState(prevState => ({showConfBounds: !prevState.showConfBounds}));
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
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="scenario-comparisons" style={styles.ContainerGray}>
                <div className="content-section">
                    <div className="content-header">{countyName}</div>
                </div>
                {this.state.dataLoaded &&
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <GraphContainer 
                            geoid={this.props.geoid}
                            width={this.props.width}
                            height={this.props.height}
                            dates={this.state.dates}
                            scenarioList={this.state.scenarioList}
                            seriesList={this.state.seriesList}
                            stat={this.state.stat}
                            severity={this.state.severity}
                            r0={this.state.r0}
                            animateTransition={this.state.animateTransition}
                            toggleAnimateTransition={this.toggleAnimateTransition}
                            simNum={this.state.simNum}
                            showConfBounds={this.state.showConfBounds}
                            confBoundsList={this.state.confBoundsList}
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

                    <Col className="gutter-row filters" span={6}>
                        <Fragment>
                            <Scenarios
                                view="graph"
                                SCENARIOS={this.state.SCENARIOS}
                                scenario={this.state.SCENARIOS[0]}
                                scenarioList={this.state.scenarioList}
                                onScenarioClick={this.handleScenarioClickGraph} />
                            <Indicators
                                stat={this.state.stat}
                                onButtonClick={this.handleButtonClick} />        
                            <Switch onConfClick={this.handleConfClick} /> 
                            <SeverityContainer
                                stat={this.state.stat}
                                severityList={this.state.severityList}
                                scenarioList={this.state.scenarioList}
                                onSeveritiesClick={this.handleSeveritiesClick}
                                onSeveritiesHover={this.handleSeveritiesHover}
                                onSeveritiesHoverLeave={this.handleSeveritiesHoverLeave} />
                            <R0
                                r0={this.state.r0}
                                onR0Change={this.handleR0Change} />
                            <Sliders 
                                stat={this.state.stat}
                                dates={this.state.dates}
                                seriesMax={this.state.seriesMax}
                                seriesMin={this.state.seriesMin}
                                statThreshold={this.state.statThreshold}
                                dateThreshold={this.state.dateThreshold}
                                dateThresholdIdx={this.state.dateThresholdIdx}
                                dateRange={this.state.dateRange}
                                onStatSliderChange={this.handleStatSliderChange}
                                onDateSliderChange={this.handleDateSliderChange}
                                onSliderMouseEvent={this.handleSliderMouseEvent} />
                        </Fragment>   
                    </Col>
                </Row>
                }
            </Content>
        )
    }
}

export default MainGraph;