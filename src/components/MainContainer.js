import React, { Component } from 'react'
// import Graph from './Graph/Graph';
import GraphContainer from './Graph/GraphContainer';
import Brush from './Filters/Brush';
// import ThresholdLabel from './Graph/ThresholdLabel';
import Legend from './Graph/Legend';
import Buttons from './Filters/Buttons';
import Scenarios from './Filters/Scenarios';
import Severity from './Filters/Severity';
import Sliders from './Filters/Sliders';
// import Overlays from './Filters/Overlays';
import { getRange } from '../utils/utils'
import { utcParse } from 'd3-time-format'
import { timeDay } from 'd3-time'
import { max, maxIndex } from 'd3-array';
const dataset = require('../store/geo06085.json');

const parseDate = utcParse('%Y-%m-%d')

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
            stat: {
                'id': 1,
                'name': 'Infections',
                'key': 'incidI'
            },
            geoid: '06085',
            scenario: {
                'id': 1,
                'key': 'USA_Uncontrolled',
                'name': 'USA_Uncontrolled'
            },
            scenarioList: [{
                'id': 1,
                'key': 'USA_Uncontrolled',
                'name': 'USA_Uncontrolled'
            }],
            severity: {
                'id': 1,
                'key': 'high',
                'name': '1% IFR, 10% hospitalization rate'}, 
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
        };
    };

    componentDidMount() {
        console.log('componentDidMount')
        const { scenario, severity, stat } = this.state;
        const initialData = dataset[scenario.key][severity.key];
        const series = initialData.series[stat.key];
        const dates = initialData.dates.map( d => parseDate(d));
        const firstDate = dates[0]; //.toISOString().split('T')[0];
        const lastDate = dates[dates.length - 1]; //.toISOString().split('T')[0];
        const [seriesMin, seriesMax] = getRange(series);
        const statThreshold = Math.ceil((seriesMax / 1.4) / 100) * 100;

        // iterate through SeriesList
        // mutates series
        const simsOver = this.updateThreshold(
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
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        const percExceedenceList = [percExceedence]

        this.setState({
            dataset,
            dates: newDates,
            allTimeDates,
            // series: filteredSeries,
            seriesList: [filteredSeries],
            allTimeSeries,
            seriesMax,
            seriesMin,
            statThreshold,
            yAxisLabel,
            firstDate,
            lastDate,
            percExceedenceList,
            graphW,
            graphH
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    };

    componentDidUpdate(prevProp, prevState) {
        if (this.state.stat !== prevState.stat ||
            this.state.scenarioList !== prevState.scenarioList ||
            this.state.severity !== prevState.severity ||
            this.state.dateRange !== prevState.dateRange) {

            const filteredSeriesList = []
            const percExceedenceList = []
            let brushSeries
            
            const { dataset, stat, scenarioList, severity } = this.state;
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
                    dataset[scenarioList[i].key][severity.key].series[stat.key]
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

                const simsOver = this.updateThreshold(
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
                // series: filteredSeries,
                seriesList: filteredSeriesList,
                allTimeSeries: brushSeries,
                dates: filteredDates,
                statThreshold,
                dateThreshold,
                seriesMin : sliderMin,
                seriesMax : sliderMax,
                percExceedenceList
            }, () => {
                console.log('componentDidUpdate')
                console.log('seriesList', this.state.seriesList)
            })
        }
    };

    updateThreshold = (series, statThreshold, dates, dateThreshold) => {
        // update 'over' flag to true if sim peak surpasses statThreshold
        // returns numSims 'over' threshold
        // first find index of dates at dateThreshold
        const dateIndex = dates.indexOf(dateThreshold);

        let simsOver = 0;
        Object.values(series).map(sim => {
            const maxIdx = maxIndex(sim.vals)
            const dateAtMax = dates[maxIdx]
            // we need to keep track of whether simval at dateThreshold is over statThreshold
            // as well as whether the max is over statThreshold and occured in the past
            if (sim.vals[dateIndex] > statThreshold || (dateAtMax < dates[dateIndex] && max(sim.vals) > statThreshold)) {
                simsOver = simsOver + 1;
                return sim.over = true;
            } else {
                return sim.over = false;
            }
        })
        return simsOver;
    }

    handleButtonClick = (i) => {
        const yAxisLabel = `Number of Daily ${i.name}`;
        this.setState({stat: i, yAxisLabel})
    };

    handleScenarioClick = (i) => {
        const copy = Array.from(this.state.scenarioList);
        const scenarioKeys = Object.values(copy).map(scenario => scenario.key);

        // add if new scenario is selected otherwise remove
        let newScenario = i;
        if (!scenarioKeys.includes(i.key)) {
            copy.push(i);
        } else {
            copy.splice(copy.indexOf(i.key), 1);
            // reset current scenario
            newScenario = copy[0];
        }

        this.setState({
            scenario: newScenario,
            scenarioList: copy,
        }, () => {
            // console.log('handleScenario scenario', newScenario)
            // console.log('handleScenario scenarioList', copy)
        })        
    };

    handleSeverityClick = (i) => {
        this.setState({severity: i});
    };

    handleStatSliderChange = (thresh) => {
        const { dates, dateThreshold, allTimeDates } = this.state;
        // const rounded = Math.ceil(i / 100) * 100;
        const copyList = Array.from(this.state.seriesList);
        const allSeriesCopy = Array.from(this.state.allTimeSeries);
        this.updateThreshold(allSeriesCopy, thresh, allTimeDates, dateThreshold);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = this.updateThreshold(copyList[i], thresh, dates, dateThreshold);
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
        this.updateThreshold(allSeriesCopy, statThreshold, allTimeDates, thresh);
        const percExceedenceList = [];

        for (let i = 0; i < copyList.length; i++) {
            const simsOver = this.updateThreshold(copyList[i], statThreshold, dates, thresh);
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
        // console.log(i)
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
        const scenarioTitleList = this.state.scenarioList.map( scenario => {
            return scenario.name.replace('_', ' ');
        })
        const scenarioTitle = this.state.scenario.name.replace('_', ' ');
        return (
            <div className="main-container">
                <div className="container no-margin">
                    <div className="row">
                        <div className="col-9">
                            <div className="row">
                            <div className="col-7">
                                <Buttons
                                    stat={this.state.stat}
                                    onButtonClick={this.handleButtonClick}
                                />
                                </div>
                                <div className="col-5">
                                    <Legend />
                                </div>
                            </div>
                            
                            <p></p>

                            {/* temp title row + legend */}
                            
                                {
                                    (scenarioTitleList.length === 1) ?
                                    <div className="row">
                                        <div className="col-3"></div>
                                        <div className="col-6">
                                            <p className="filter-label scenario-title">
                                                {scenarioTitleList[0]}
                                            </p>
                                        </div>
                                        {/* <div className="col-3">
                                            <Legend />
                                        </div> */}
                                    </div>
                                    :
                                    <div className="row">
                                        <div className="col-6">
                                             <p className="filter-label scenario-title">
                                                {scenarioTitleList[0]}
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="filter-label scenario-title">
                                                {scenarioTitleList[1]}
                                            </p>
                                        </div>
                                        {/* <div className="col-3">
                                            <Legend />
                                        </div> */}
                                    </div>
                                }
                                {/* {scenarioTitleList.map((scenarioTitle, i) => {
                                    return ((scenarioTitleList.length) > 1 ? 
                                        <div className="col-3"></div>
                                        <div className="col-6">
                                            <p className="filter-label scenario-title">
                                                {scenarioTitle}
                                            </p>
                                        </div> :
                                        <div className="col-3"></div>
                                        <div className="col-6">
                                            <p className="filter-label scenario-title">
                                                {scenarioTitle}
                                            </p>
                                        </div>
                                )} )} */ }

                                

                            <div
                                className="graph"
                                ref={ (graphEl) => { this.graphEl = graphEl } }
                                >
                                {this.state.dataLoaded &&
                                <div>
                                    <GraphContainer 
                                        stat={this.state.stat}
                                        geoid={this.state.geoid}
                                        yAxisLabel={this.state.yAxisLabel}
                                        // scenario={this.state.scenario}
                                        scenarioList={this.state.scenarioList}
                                        severity={this.state.severity}
                                        r0={this.state.r0}
                                        simNum={this.state.simNum}
                                        showConfBounds={this.state.showConfBounds}
                                        showActual={this.state.showActual}
                                        // series={this.state.series}
                                        seriesList={this.state.seriesList}
                                        dates={this.state.dates}
                                        statThreshold={this.state.statThreshold}
                                        dateThreshold={this.state.dateThreshold}
                                        percExceedenceList={this.state.percExceedenceList}
                                        dateRange={this.state.dateRange}
                                        brushActive={this.state.brushActive}
                                        width={this.state.graphW}
                                        height={this.state.graphH}
                                    /> 
                                    <Brush
                                        series={this.state.allTimeSeries}
                                        dates={this.state.allTimeDates}
                                        width={this.state.graphW}
                                        height={80}
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
                        <div className="col-3">
                            <h5>Scenarios
                                <div className="tooltip">&nbsp;&#9432;
                                    <span className="tooltip-text">There are 3 intervention scenarios for model simulations for comparison.</span>
                                </div>
                            </h5>
                            
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
                            <div className="param-header">Severity
                                <div className="tooltip">&nbsp;&#9432;
                                    <span className="tooltip-text">There are three levels of severity (high, medium, low) based on Infection-fatality-ratio (IFR) and hospitalization rate.</span>
                                </div>
                            </div>
                            <Severity 
                                severity={this.state.severity}
                                onSeverityClick={this.handleSeverityClick}
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