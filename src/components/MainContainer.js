import React, { Component } from 'react'
import GraphContainer from './Graph/GraphContainer';
import Search from './Search'
import Brush from './Filters/Brush';
import Legend from './Graph/Legend';
import Buttons from './Filters/Buttons';
import Scenarios from './Filters/Scenarios';
import SeverityContainer from './Filters/SeverityContainer';
import Sliders from './Filters/Sliders';
// import Overlays from './Filters/Overlays';
import _ from 'lodash';
import { getRange } from '../utils/utils'
import { utcParse, timeFormat } from 'd3-time-format'
import { timeDay } from 'd3-time'
import { max, maxIndex } from 'd3-array';
import { STATS, SCENARIOS, LEVELS, margin } from '../utils/constants';
const dataset = require('../store/geo06085.json');

const parseDate = utcParse('%Y-%m-%d')
const formatDate = timeFormat('%Y-%m-%d')

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false,
            series: {},
            seriesList: [{}],
            allTimeSeries: {},
            dates: [],
            allTimeDates: [],
            yAxisLabel: '',
            stat: STATS[0],
            geoid: '06085',
            scenario: SCENARIOS[0],
            scenarioList: [SCENARIOS[0]],           
            severity: _.cloneDeep(LEVELS[0]), 
            severityList: [_.cloneDeep(LEVELS[0])],
            scenarioHovered: '',
            statThreshold: 0,
            seriesMax: Number.NEGATIVE_INFINITY,
            seriesMin: Number.POSITIVE_INFINITY,
            dateThreshold: parseDate('2020-05-04'),
            dateRange: [parseDate('2020-03-01'), parseDate('2020-07-01')],
            firstDate: '',
            lastDate: '',
            r0: '1',
            simNum: '150',
            percExceedenceList: [],
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
            brushActive: false,
            scenarioClickCounter: 0,
        };
    };

    componentDidMount() {
        console.log('componentDidMount')
        window.addEventListener('resize', this.updateGraphDimensions)
        this.updateGraphDimensions()
        const { scenario, severity, stat } = this.state;
        const initialData = dataset[scenario.key][severity.key];
        const series = initialData.series[stat.key];
        const dates = initialData.dates.map( d => parseDate(d));
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const [seriesMin, seriesMax] = getRange(series);
        const statThreshold = Math.ceil((seriesMax / 1.4) / 100) * 100;

        // add scenario to severity list
        const sevList = _.cloneDeep(this.state.severityList);
        sevList[0].scenario = scenario.key;

        // iterate through SeriesList
        const simsOver = this.updateThresholdIterate(
            series,
            statThreshold,
            dates,
            this.state.dateThreshold
            )        
        const percExceedence = simsOver / series.length;

        // send these sims to brush after it's been colored
        // include in SeriesList loop
        // if (firstIndex of SeriesList)
        const allTimeSeries = Array.from(series)
        // shouldn't happen twice
        const allTimeDates = Array.from(dates)

        // take out of loop so not redundant
        const idxMin = timeDay.count(firstDate, this.state.dateRange[0]);
        const idxMax = timeDay.count(firstDate, this.state.dateRange[1]);
       // include in loop
        const newDates = Array.from(allTimeDates.slice(idxMin, idxMax));
        const filteredSeries = series.map( s => {
            const newS = {...s}
            newS.vals = s.vals.slice(idxMin, idxMax)
            return newS
        })
        
        // out of loop
        const yAxisLabel = `Number of ${stat.name} per Day`;

        // const graphW = this.graphEl.clientWidth - margin.yAxis;
        // const graphH = this.graphEl.clientHeight;

        const percExceedenceList = [percExceedence]

        this.setState({
            dataset,
            dates: newDates,
            allTimeDates,
            seriesList: [filteredSeries],
            severityList: sevList,
            allTimeSeries,
            seriesMax,
            seriesMin,
            statThreshold,
            yAxisLabel,
            firstDate,
            lastDate,
            percExceedenceList,
            // graphW,
            // graphH
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    };

    componentDidUpdate(prevProp, prevState) {
        if (this.state.stat !== prevState.stat ||
            this.state.scenarioList !== prevState.scenarioList ||
            this.state.severityList !== prevState.severityList ||
            this.state.dateRange !== prevState.dateRange ||
            this.state.dataset !== prevState.dataset) {
            console.log('componentDidUpdate')

            const filteredSeriesList = []
            const percExceedenceList = []
            let brushSeries
            
            const { dataset, stat, severityList, scenarioList } = this.state;
            // filter series and dates by dateRange
            const idxMin = timeDay.count(this.state.firstDate, this.state.dateRange[0]);
            const idxMax = timeDay.count(this.state.firstDate, this.state.dateRange[1]);
            const filteredDates = Array.from(this.state.allTimeDates.slice(idxMin, idxMax));
            const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
            const dateThreshold = filteredDates[dateThresholdIdx]
            let statThreshold = 0
            let sliderMin = 100000000000
            let sliderMax = 0

            for (let i = 0; i < scenarioList.length; i++) {
                const newSeries = Array.from(
                    dataset[scenarioList[i].key][severityList[i].key].series[stat.key]
                    );
                const filteredSeriesForStatThreshold = newSeries.map( s => {
                    const newS = {...s}
                    newS.vals = s.vals.slice(idxMin, idxMax)
                    return newS
                });

                const [seriesMin, seriesMax] = getRange(filteredSeriesForStatThreshold);
                if (seriesMin < sliderMin) sliderMin = seriesMin
                if (seriesMax > sliderMax) sliderMax = seriesMax
                // update dateThreshold before updating statThreshold?
                if (i === 0) statThreshold = Math.ceil(seriesMax / 1.2);

                const simsOver = this.updateThresholdIterate(
                    newSeries,
                    statThreshold,
                    this.state.allTimeDates,
                    dateThreshold
                )
                if (i === 0) brushSeries = newSeries

                const percExceedence = simsOver / newSeries.length;
                percExceedenceList.push(percExceedence)

                const filteredSeries = newSeries.map( s => {
                    const newS = {...s}
                    newS.vals = s.vals.slice(idxMin, idxMax)
                    return newS
                })
                filteredSeriesList.push(filteredSeries)
            }
            this.setState({
                seriesList: filteredSeriesList,
                allTimeSeries: brushSeries,
                dates: filteredDates,
                statThreshold,
                dateThreshold,
                seriesMin : sliderMin,
                seriesMax : sliderMax,
                percExceedenceList
            })
        }
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGraphDimensions)
    }

    updateGraphDimensions = () => {
        const graphW = this.graphEl.clientWidth - margin.yAxis;
        const graphH = this.graphEl.clientHeight;
        // console.log('updating graph dimensions', graphW, graphH)
        this.setState({ graphW, graphH });
      }

    updateThresholdIterate = (series, statThreshold, dates, dateThreshold) => {
        const dateIndex = dates.findIndex( date => formatDate(date) === formatDate(dateThreshold));
        // console.log('dateThreshold', dateThreshold)
        // console.log('dateIndex', dateIndex)
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
            // console.log(`sim ${simIdx} is over is ${simOver}`)
            simOver ? sim.over = true : sim.over = false
        })
        return simsOver;
    }

    updateThreshold = (series, statThreshold, dates, dateThreshold) => {
        // update 'over' flag to true if sim peak surpasses statThreshold
        // returns numSims 'over' threshold
        // first find index of dates at dateThreshold
        const dateIndex = dates.indexOf(dateThreshold);
        // console.log('statThreshold', statThreshold)
        // console.log('dateThreshold', dateThreshold)
        // console.log('dateIndex', dateIndex)

        let simsOver = 0;
        Object.values(series).map(sim => {
            // calculate max once, use to find maxIndex
            const maxVal = max(sim.vals)
            const maxIdx = maxIndex(sim.vals)
            const dateAtMax = dates[maxIdx]
            // console.log(sim.vals[dateIndex])
            // we need to keep track of whether simval at dateThreshold is over statThreshold
            // as well as whether the max is over statThreshold and occured in the past
            if (sim.vals[dateIndex] > statThreshold
                || (dateAtMax < dateThreshold && maxVal > statThreshold)) {
                simsOver = simsOver + 1;
                return sim.over = true;
            } else {
                return sim.over = false;
            }
        })
        return simsOver;
    }

    handleCountySelect = (i) => {
        console.log('main', i)
        // uncomment when public model files are hooked up
        // this.setState({dataset: i})
    }
    
    handleUpload = (i) => {
        this.setState({dataset: i})
    }

    handleButtonClick = (i) => {
        const yAxisLabel = `Number of Daily ${i.name}`;
        this.setState({stat: i, yAxisLabel})
    };

    handleScenarioClick = (i) => {
        let newScenarios = Array.from(this.state.scenarioList);
        let newSevs = _.cloneDeep(this.state.severityList);
        const scenarioKeys = Object.values(newScenarios).map(s => s.key);
        const scenarioClkCntr = this.state.scenarioClickCounter + 1;

        // new scenario being selectede
        if (!scenarioKeys.includes(i.key)) {
            // return high sev as default
            const defaultSev = _.cloneDeep(LEVELS[0]); 
            defaultSev.scenario = i.key;
            newSevs.push(defaultSev)
            newScenarios.push(i);
        // scenario being turned off
        } else {
            if (this.state.scenarioList.length > 1) {
                newSevs = newSevs.filter(sev => sev.scenario !== i.key)
                newScenarios = newScenarios.filter(scenario => scenario.key !== i.key);
            } 
        }
        this.setState({
            scenarioList: newScenarios,
            scenarioClickCounter: scenarioClkCntr,
            severityList: newSevs
        })        
    };

    handleSeveritiesClick = (i) => {
        let newSevList = _.cloneDeep(this.state.severityList);
        newSevList.forEach(sev => {
            if (sev.scenario === i.scenario) {
                return sev.key = i.key;
            }
        })
        this.setState({severityList: newSevList});
    };

    handleSeveritiesHover = (i) => {
        this.setState({
            scenarioHovered: i,
        })
    }

    handleSeveritiesHoverLeave = () => {
        this.setState({
            scenarioHovered: '',
        })
    }

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
            percExceedenceList
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

    handleBrushRange = (i) => {
        this.setState({
            dateRange: i
        });
    };

    handleBrushStart = () => {
        this.setState({
            brushActive: true
        })
    }

    handleBrushEnd = () => {
        this.setState({
            brushActive: false
        })
    }

    handleReprSliderChange = (i) => {
        this.setState({r0: i});
    };

    handleConfClick = (i) => {
        this.setState(prevState => ({
            showConfBounds: !prevState.showConfBounds
        }));
    };

    handleActualClick = (i) => {
        this.setState(prevState => ({
            showActual: !prevState.showActual
        }));
    };

    render() {
        return (
            <div className="main-container">
                <div className="container no-margin">
                    <div className="row">
                        <div className="col-9">
                            <Search 
                                stat={this.state.stat}
                                onFileUpload={this.handleUpload}
                                onCountySelect={this.handleCountySelect}
                            />
                            <div className="row">
                            <div className="col-9">
                                <Buttons
                                    stat={this.state.stat}
                                    onButtonClick={this.handleButtonClick}
                                />
                                </div>
                                <div className="col-3">
                                    <Legend />
                                </div>
                            </div>
                            <p></p>

                            <div
                                className="graph resetRow"
                                ref={ (graphEl) => { this.graphEl = graphEl } }
                                >
                                {this.state.dataLoaded &&
                                <div>
                                    <GraphContainer 
                                        stat={this.state.stat}
                                        geoid={this.state.geoid}
                                        yAxisLabel={this.state.yAxisLabel}
                                        scenarioList={this.state.scenarioList}
                                        severity={this.state.severity}
                                        r0={this.state.r0}
                                        simNum={this.state.simNum}
                                        showConfBounds={this.state.showConfBounds}
                                        showActual={this.state.showActual}
                                        seriesList={this.state.seriesList}
                                        dates={this.state.dates}
                                        statThreshold={this.state.statThreshold}
                                        dateThreshold={this.state.dateThreshold}
                                        percExceedenceList={this.state.percExceedenceList}
                                        dateRange={this.state.dateRange}
                                        brushActive={this.state.brushActive}
                                        width={this.state.graphW}
                                        height={this.state.graphH}
                                        scenarioClickCounter={this.state.scenarioClickCounter}
                                        scenarioHovered={this.state.scenarioHovered}
                                    /> 
                                    <Brush
                                        series={this.state.allTimeSeries}
                                        dates={this.state.allTimeDates}
                                        width={this.state.graphW}
                                        height={80}
                                        x={margin.yAxis}
                                        y={0}
                                        dateRange={this.state.dateRange}
                                        dateThreshold={this.state.dateThreshold}
                                        statThreshold={this.state.statThreshold}
                                        onBrushChange={this.handleBrushRange}
                                        onBrushStart={this.handleBrushStart}
                                        onBrushEnd={this.handleBrushEnd}
                                    />
                                </div>
                                }
                            </div>
                        </div>
                        <div className="col-3 filters">
                            <h5 className="scenario-header">Scenarios
                                <div className="tooltip">&nbsp;&#9432;
                                    <span className="tooltip-text">
                                    There are 3 intervention scenarios for model
                                    simulations for comparison.
                                    </span>
                                </div>
                            </h5>
                            <span className="subtitle">(select up to 2)</span>                            
                            <Scenarios 
                                scenario={this.state.scenario}
                                scenarioList={this.state.scenarioList}
                                onScenarioClick={this.handleScenarioClick}
                            />
                            <p></p>
                            {/* <h5>Overlays</h5>
                            <Overlays 
                                showConfBounds={this.state.showConfBounds}
                                showActual={this.state.showActual}
                                onConfClick={this.handleConfClick}
                                onActualClick={this.handleActualClick}
                            />                         */}
                            <h5>Parameters</h5>
                            <SeverityContainer
                                severityList={this.state.severityList}
                                scenarioList={this.state.scenarioList}
                                onSeveritiesClick={this.handleSeveritiesClick}
                                onSeveritiesHover={this.handleSeveritiesHover}
                                onSeveritiesHoverLeave={this.handleSeveritiesHoverLeave}
                            />
                            <p></p>
                            <h5>Thresholds</h5>
                            {this.state.dataLoaded &&
                            <Sliders 
                                stat={this.state.stat}
                                dates={this.state.dates}
                                seriesMax={this.state.seriesMax}
                                seriesMin={this.state.seriesMin}
                                statThreshold={this.state.statThreshold}
                                dateThreshold={this.state.dateThreshold}
                                dateThresholdIdx={this.state.dateThresholdIdx}
                                firstDate={this.state.firstDate}
                                lastDate={this.state.lastDate}
                                dateRange={this.state.dateRange}
                                onStatSliderChange={this.handleStatSliderChange}
                                onDateSliderChange={this.handleDateSliderChange}
                                // // onReprSliderChange={this.handleReprSliderChange}
                            />
                            }
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MainContainer;