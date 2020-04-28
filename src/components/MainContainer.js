import React, { Component } from 'react'
import Graph from './Graph.js';
import Brush from './Filters/Brush.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
// import Overlays from './Filters/Overlays.js';
import { getRange, updateThresholdFlag } from '../utils/utils.js'
import { utcParse, timeFormat } from 'd3-time-format'
import { max } from 'd3-array';
const dataset = require('../store/geo06085.json');

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false,
            series: {},
            allTimeSeries: {},
            dates: [],
            allTimeDates: [],
            // this.state = {
            //     series: this will be updated based on scenario, stat, sev, statFilter, AND DateFilter ranges
            //     dates: this will be updated based on scenario, stat, sev, statFilter, AND DateFilter ranges
            //     allTimeSeries: this will be updated based on scenario, stat, sev but NOT on DateFilter ranges
            //     allTimeDates: this will be updated based on scenario, stat, sev but NOT on DateFilter ranges
            //   }
            yAxisLabel: '',
            stat: {
                'id': 1,
                'name': 'Infections',
                'key': 'incidI'
            },
            geoid: '101',
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
            dateRange: ['2020-03-01', '2020-07-01'],
            firstDate: '',
            r0: '1',
            simNum: '150',
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
        updateThresholdFlag(series, statThreshold);
        const allTimeSeries = Array.from(series)
        const allTimeDates = Array.from(dates)
        
        const yAxisLabel = `Number of ${stat.name} per Day`;
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        this.setState({
            dataset,
            dates,
            allTimeDates,
            series,
            allTimeSeries,
            seriesMax,
            seriesMin,
            statThreshold,
            yAxisLabel,
            firstDate,
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

            updateThresholdFlag(newSeries, statThreshold)
            
            this.setState({
                series: newSeries,
                allTimeSeries: newSeries,
                statThreshold,
                seriesMin,
                seriesMax
            })
        }
        if (this.state.dateRange !== prevState.dateRange) {
            const { dataset, stat, scenario, severity, series, dates, dateRange } = this.state;
            // const newSeries = Array.from(
            //     dataset[scenario.key][severity.key].series[stat.key]
            //     );
            let minIndex, maxIndex;
            const formatDate = timeFormat("%B %d, %Y");
            const newDates = dates.filter( (date, index) => { 
                if (formatDate(date) === formatDate(dateRange[0])) minIndex = index
                if (formatDate(date) === formatDate(dateRange[1])) maxIndex = index
                return date >= dateRange[0] && date < dateRange[1]
            })
            console.log(newDates)
            console.log(minIndex, maxIndex, maxIndex-minIndex)
            const newSeries = Array.from(series).map( s => {
                const newS = {...s}
                newS.vals = s.vals.slice(minIndex, maxIndex)
                return newS
            })
            console.log(newSeries)
            this.setState({
                dates: newDates,
                series: newSeries
            })
        }
    };

    handleButtonClick = (i) => {
        const yAxisLabel = `Number of ${i.name} per Day`;
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
        updateThresholdFlag(copy, i)

        this.setState({
            series: copy,
            statThreshold: +i
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

    handleBrushChange = (i) => {
        this.setState({ dateRange: i })
    }

    render() {
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

                            <p className="filter-text scenario-title">
                                {this.state.scenario.name}
                            </p>
                            <div
                                className="graph border"
                                ref={ (graphEl) => { this.graphEl = graphEl } }
                                >
                                {this.state.dataLoaded &&
                                <div>
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
                                    /> 
                                    <Brush
                                        series={this.state.allTimeSeries}
                                        dates={this.state.allTimeDates}
                                        width={this.state.graphW}
                                        height={80}
                                        dateRange={this.state.dateRange}
                                        onBrushChange={this.handleBrushChange}
                                    />
                                </div>
                                }
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