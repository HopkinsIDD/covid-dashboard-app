import React, { Component } from 'react'
import Graph from './Graph/Graph.js';
import ThresholdLabel from './Graph/ThresholdLabel.js';
import Legend from './Graph/Legend.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
// import Overlays from './Filters/Overlays.js';
import { getRange, updateThresholdFlag } from '../utils/utils.js'
import { utcParse } from 'd3-time-format'
import { max } from 'd3-array';
const dataset = require('../store/geo06085.json');

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false,
            series: {},
            dates: [],
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
            severity: {
                'id': 1,
                'key': 'high',
                'name': '1% IFR, 10% hospitalization rate'}, 
            statThreshold: 0,
            seriesMax: Number.NEGATIVE_INFINITY,
            seriesMin: Number.POSITIVE_INFINITY,
            dateThreshold: '2020-04-01',
            dateRange: ['2020-03-01', '2020-07-01'],
            firstDate: '',
            r0: '1',
            simNum: '150',
            percExceedence: 0,
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
        };
    };

    async componentDidMount() {
        console.log('componentDidMount')
        const { scenario, severity, geoid, stat } = this.state;
        const initialData = dataset[scenario.key][severity.key];
        const series = initialData.series[stat.key];
        const parseDate = utcParse("%Y-%m-%d");
        const dates = initialData.dates.map( d => parseDate(d));
        const firstDate = dates[0];
        
        const [seriesMin, seriesMax] = getRange(series);
        const statThreshold = Math.ceil((seriesMax / 1.2) / 100) * 100;
        // mutates series
        const simsOver = updateThresholdFlag(series, statThreshold); 
        const percExceedence = simsOver / series.length;
        
        const yAxisLabel = `Number of Daily ${stat.name} in ${geoid}`;
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        this.setState({
            dataset,
            dates,
            series,
            seriesMax,
            seriesMin,
            statThreshold,
            yAxisLabel,
            firstDate,
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
            this.state.severity !== prevState.severity) {

            const { dataset, stat, scenario, severity } = this.state;
            const newSeries = Array.from(
                dataset[scenario.key][severity.key].series[stat.key]
                );
            const [seriesMin, seriesMax] = getRange(newSeries);
            const statThreshold = Math.ceil(seriesMax / 1.2);
            // const statThreshold = Math.ceil((seriesMax / 1.2) / 100) * 100;

            // mutates series
            const simsOver = updateThresholdFlag(newSeries, statThreshold)
            const percExceedence = simsOver / newSeries.length;

            this.setState({
                series: newSeries,
                statThreshold,
                seriesMin,
                seriesMax,
                percExceedence
            })
        }
    };

    handleButtonClick = (i) => {
        const yAxisLabel = `Number of Daily ${i.name}`;
        this.setState({stat: i, yAxisLabel})
    };

    handleScenarioClick = (i) => {
        this.setState({scenario: i})
    };

    handleSeverityClick = (i) => {
        this.setState({severity: i});
    };

    handleStatSliderChange = (i) => {
        // const rounded = Math.ceil(i / 100) * 100;
        const copy = Array.from(this.state.series);
        const simsOver = updateThresholdFlag(copy, i);
        const percExceedence = simsOver / copy.length;

        this.setState({
            series: copy,
            statThreshold: +i,
            percExceedence
        });
    };

    handleDateSliderChange = (i) => {
        // for example, if props received is dateRange like i = [minDate, maxDate]
        const parseDate = utcParse("%Y-%m-%d");
        const dateRange = [parseDate(i[0]), parseDate(i[1])];
        const idxMin = dateRange[0] - this.state.firstDate;
        const idxMax = dateRange[1] - this.state.firstDate;

        const copyDates = Array.from(this.state.dates.slice(idxMin, idxMax));
        const copySeries = Array.from(this.state.series);
        Object.values(copySeries).map(sim => sim.vals.splice(idxMin, idxMax));

        this.setState({
            series: copySeries,
            dates: copyDates,
        });
    };

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

                            <p className="filter-label scenario-title">
                                {scenarioTitle}
                            </p>
                            <div
                                className="graph border"
                                ref={ (graphEl) => { this.graphEl = graphEl } }
                                >
                                <ThresholdLabel
                                    statThreshold={this.state.statThreshold}
                                    dateThreshold={this.state.dateThreshold}
                                    percExceedence={this.state.percExceedence}
                                />
                                {this.state.dataLoaded &&
                                <Graph 
                                    stat={this.state.stat}
                                    geoid={this.state.geoid}
                                    yAxisLabel={this.state.yAxisLabel}
                                    scenario={this.state.scenario}
                                    severity={this.state.severity}
                                    r0={this.state.r0}
                                    simNum={this.state.simNum}
                                    showConfBounds={this.state.showConfBounds}
                                    showActual={this.state.showActual}
                                    series={this.state.series}
                                    dates={this.state.dates}
                                    statThreshold={this.state.statThreshold}
                                    width={this.state.graphW}
                                    height={this.state.graphH}
                                /> }
                            </div>
                        </div>
                        <div className="col-3">
                            <h5>Scenarios</h5>
                            <Scenarios 
                                scenario={this.state.scenario}
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
                            <p className="param-header">Severity</p>
                            <Severity 
                                severity={this.state.severity}
                                onSeverityClick={this.handleSeverityClick}
                            />
                            <p></p>
                            <h5>Thresholds</h5>
                            <Sliders 
                                stat={this.state.stat}
                                seriesMax={this.state.seriesMax}
                                seriesMin={this.state.seriesMin}
                                statThreshold={this.state.statThreshold}
                                onStatSliderChange={this.handleStatSliderChange}
                                onReprSliderChange={this.handleReprSliderChange}
                            />

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MainContainer;