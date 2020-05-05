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
            percExceedence: 0,
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

        // mutates series
        const simsOver = this.updateThreshold(
            series,
            statThreshold,
            dates,
            this.state.dateThreshold
            )        
        const percExceedence = simsOver / series.length;

        const allTimeSeries = Array.from(series)
        const allTimeDates = Array.from(dates)

        const idxMin = timeDay.count(firstDate, this.state.dateRange[0]);
        const idxMax = timeDay.count(firstDate, this.state.dateRange[1]);
        const newDates = Array.from(allTimeDates.slice(idxMin, idxMax));
        const filteredSeries = series.map( s => {
            const newS = {...s}
            newS.vals = s.vals.slice(idxMin, idxMax)
            return newS
        })
        
        const yAxisLabel = `Number of ${stat.name} per Day`;
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        this.setState({
            dataset,
            dates: newDates,
            allTimeDates,
            series: filteredSeries,
            seriesList: [filteredSeries],
            allTimeSeries,
            seriesMax,
            seriesMin,
            statThreshold,
            yAxisLabel,
            firstDate,
            lastDate,
            percExceedence,
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
            this.state.scenario !== prevState.scenario ||
            this.state.severity !== prevState.severity ||
            this.state.dateRange !== prevState.dateRange) {

            const { dataset, stat, scenario, severity } = this.state;
            const newSeries = Array.from(
                dataset[scenario.key][severity.key].series[stat.key]
                );
            // filter series and dates by dateRange
            const idxMin = timeDay.count(this.state.firstDate, this.state.dateRange[0]);
            const idxMax = timeDay.count(this.state.firstDate, this.state.dateRange[1]);

            const filteredDates = Array.from(this.state.allTimeDates.slice(idxMin, idxMax));
            const filteredSeriesForStatThreshold = newSeries.map( s => {
                const newS = {...s}
                newS.vals = s.vals.slice(idxMin, idxMax)
                return newS
            });
            const [seriesMin, seriesMax] = getRange(filteredSeriesForStatThreshold);

             // update dateThreshold before updating statThreshold?
            const statThreshold = Math.ceil(seriesMax / 1.2);
            const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
            const dateThreshold = filteredDates[dateThresholdIdx]

            const simsOver = this.updateThreshold(
                newSeries,
                statThreshold,
                this.state.allTimeDates,
                dateThreshold
            )

            const percExceedence = simsOver / newSeries.length;

            const filteredSeries = newSeries.map( s => {
                const newS = {...s}
                newS.vals = s.vals.slice(idxMin, idxMax)
                return newS
            })

            // add if series is new, remove if otherwise
            let newSeriesList = Array.from(this.state.seriesList);
            // todo: fix this workaround, issues setting equality between arrays
            const sumSeries = newSeriesList[0][0].vals.reduce((sum, a) => sum + a, 0);
            const sumNew = filteredSeries[0].vals.reduce((sum, a) => sum + a, 0);
            const isEqual = sumSeries === sumNew;

            // console.log('active scenario', this.state.scenario)
            // console.log('newSeriesList', newSeriesList)
            // console.log('filteredSeries', filteredSeries)
            // console.log('isEqual', isEqual)

            if (isEqual) {
                newSeriesList = [filteredSeries];
            } else {
                newSeriesList.push(filteredSeries);
            }

            this.setState({
                series: filteredSeries,
                seriesList: newSeriesList,
                allTimeSeries: newSeries,
                dates: filteredDates,
                statThreshold,
                dateThreshold,
                seriesMin,
                seriesMax,
                percExceedence
            }, () => {
                console.log('componentDidUpdate')
                console.log('seriesList', this.state.seriesList)
            })
        }
    };

    updateThreshold(series, statThreshold, dates, dateThreshold) {
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
            console.log('handleScenario scenario', newScenario)
            console.log('handleScenario scenarioList', copy)
        })        
    };

    handleSeverityClick = (i) => {
        this.setState({severity: i});
    };

    handleStatSliderChange = (i) => {
        const { dates, dateThreshold, allTimeDates } = this.state;
        // const rounded = Math.ceil(i / 100) * 100;
        const copy = Array.from(this.state.series);
        // const simsOver = this.updateThreshold(copy, i, dates, dateThreshold);
        const simsOver = this.updateThreshold(copy, i, dates, dateThreshold);
        const allSeriesCopy = Array.from(this.state.allTimeSeries)
        // this.updateThreshold(allSeriesCopy, i, allTimeDates, dateThreshold)
        this.updateThreshold(allSeriesCopy, i, allTimeDates, dateThreshold)
        
        const percExceedence = simsOver / copy.length;

        this.setState({
            series: copy,
            allTimeSeries: allSeriesCopy,
            statThreshold: +i,
            percExceedence
        });
    };

    handleDateSliderChange = (i) => {
        const { statThreshold, dates, allTimeDates } = this.state;
        const copy = Array.from(this.state.series);
        // const simsOver = this.updateThreshold(copy, statThreshold, dates, i);
        const simsOver = this.updateThreshold(copy, statThreshold, dates, i);
        const allSeriesCopy = Array.from(this.state.allTimeSeries)
        // this.updateThreshold(allSeriesCopy, statThreshold, allTimeDates, i);
        this.updateThreshold(allSeriesCopy, statThreshold, allTimeDates, i);
        const percExceedence = simsOver / copy.length;

        this.setState({
            series: copy,
            allTimeSeries: allSeriesCopy,
            dateThreshold: i,
            percExceedence
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
        const scenarioTitle = this.state.scenario.name.replace('_', ' ');
        return (
            <div className="main-container">
                <div className="container no-margin">
                    <div className="row">
                        <div className="col-9">
                            <Buttons
                                stat={this.state.stat}
                                onButtonClick={this.handleButtonClick}
                                />
                            <p></p>

                            {/* temp title row + legend */}
                            <div className="row">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <p className="filter-label scenario-title">
                                        {scenarioTitle}
                                    </p>
                                </div>
                                <div className="col-3">
                                    <Legend />
                                </div>
                            </div>

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
                                        scenario={this.state.scenario}
                                        scenarioList={this.state.scenarioList}
                                        severity={this.state.severity}
                                        r0={this.state.r0}
                                        simNum={this.state.simNum}
                                        showConfBounds={this.state.showConfBounds}
                                        showActual={this.state.showActual}
                                        series={this.state.series}
                                        seriesList={this.state.seriesList}
                                        dates={this.state.dates}
                                        statThreshold={this.state.statThreshold}
                                        dateThreshold={this.state.dateThreshold}
                                        percExceedence={this.state.percExceedence}
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