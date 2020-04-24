import React, { Component } from 'react'
import Graph from './Graph.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
import Overlays from './Filters/Overlays.js';
import { utcParse } from 'd3-time-format'
import { STATOBJ, LEVOBJ } from '../store/constants.js';
const rawData = require('../store/high_death.json')


class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleScenarioClick = this.handleScenarioClick.bind(this);
        this.handleSeverityClick = this.handleSeverityClick.bind(this);
        this.handleStatSliderChange = this.handleStatSliderChange.bind(this);
        this.handleReprSliderChange = this.handleReprSliderChange.bind(this);
        this.handleSimSliderChange = this.handleSimSliderChange.bind(this);
        this.handleConfClick = this.handleConfClick.bind(this);
        this.handleActualClick = this.handleActualClick.bind(this);
        this.state = {
            dataset: {},
            dataLoaded: false,
            series: {},
            seriesMax: 0,
            dates: [],
            yAxisLabel: '',
            stat: 'Infections',
            geoid: '101',
            scenario: 'Fixed Lockdown',
            severity: 'high',
            statThreshold: 0,
            r0: '1',
            simNum: '150',
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
        };
    }

    buildDummyDataset() {
        // Temp function to build out a dummy dataset given unknown input data format 
        // eg: csv, parquet, json? 
        // Only first simulation of incidI infections were altered to visualize change
        const medData = JSON.parse(JSON.stringify(rawData));
        medData.series['incidI'][0].values = medData.series['incidI'][0].values.map(d => d/2);

        const lowData = JSON.parse(JSON.stringify(rawData));
        lowData.series['incidI'][0].values = lowData.series['incidI'][0].values.map(d => d/3);

        const hiData2= JSON.parse(JSON.stringify(rawData));
        hiData2.series['incidI'][0].values = hiData2.series['incidI'][0].values.map(d => d*4);

        const medData2= JSON.parse(JSON.stringify(rawData));
        medData2.series['incidI'][0].values = medData2.series['incidI'][0].values.map(d => d*2);

        const lowData2= JSON.parse(JSON.stringify(rawData));
        lowData2.series['incidI'][0].values = lowData2.series['incidI'][0].values.map(d => d*1.5);


        const dummy = {
            'Fixed Lockdown': {
                'high': rawData,
                'medium': medData,
                'low': lowData,
            },
            'Fatiguing Lockdown': {
                'high': hiData2,
                'medium': medData2,
                'low': lowData2,
            }
        }
        return dummy;
    };

    async componentDidMount() {
        const dataset = this.buildDummyDataset();
        const initialData = dataset[this.state.scenario][this.state.severity];

        const parseDate = utcParse("%Y-%m-%d");
        const dates = initialData.dates.map( d => parseDate(d));
        const series = initialData.series[STATOBJ[this.state.stat]];
        series.map(sim => sim['display'] = true);
        const seriesMax = Math.max.apply(null, series[0].values);
        const yAxisLabel = `Number of Daily ${this.state.stat} in ${this.state.geoid}`;
        
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        this.setState({
            dataset,
            dates,
            series,
            seriesMax,
            yAxisLabel,
            graphW,
            graphH
        }, () => {
            this.setState({
                dataLoaded: true
            })
        })
    };

    handleButtonClick(i) {
        const yAxisLabel = `Number of Daily ${i} in ${this.state.geoid}`;
        const seriesCopy = Array.from(this.state.dataset[this.state.scenario][this.state.severity].series[STATOBJ[i]]);
        const seriesMax = Math.max.apply(null, seriesCopy[0].values);
        this.setState({
            stat: i,
            series: seriesCopy,
            seriesMax,
            yAxisLabel
        })
    }

    handleScenarioClick(item) {
        if (this.state.scenario.includes(item)) {
            const scenarioCopy = Array.from(this.state.scenario);
            const index = this.state.scenario.indexOf(item);
            if (index > -1) {
                scenarioCopy.splice(index, 1);
                this.setState({
                    scenario: scenarioCopy,
                })
            };

        } else {
            this.setState({
                scenario: this.state.scenario.concat(item)
            });
        }
    }

    handleSeverityClick(i) {
        const sevCopy = Array.from(this.state.dataset[this.state.scenario][LEVOBJ[i]].series[STATOBJ[this.state.stat]]);
        this.setState({
            severity: LEVOBJ[i],
            series: sevCopy,
        });
    }

    handleStatSliderChange(i) {
        const seriesCopy = Array.from(this.state.series);
        seriesCopy.forEach(sim => {
            if (Math.max.apply(null, sim.values) < this.state.statThreshold) {
              return sim.display = false;
            } 
           });
        this.setState({
            statThreshold: i,
            series: seriesCopy,
        });
        console.log('threshold', this.state.statThreshold)
        console.log('series', this.state.series)
    }

    handleReprSliderChange(i) {
        this.setState({r0: i});
    }

    handleSimSliderChange(i) {
        this.setState({simNum: i});
    }

    handleConfClick(i) {
        this.setState(prevState => ({
            showConfBounds: !prevState.showConfBounds
        }));
    }

    handleActualClick(i) {
        this.setState(prevState => ({
            showActual: !prevState.showActual
        }));
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

                            <div className="graph border" ref={ (graphEl) => { this.graphEl = graphEl } }>
                                {this.state.dataLoaded &&
                                <Graph 
                                    stat={this.state.stat}
                                    geoid={this.state.geoid}
                                    scenario={this.state.scenario}
                                    severity={this.state.severity}
                                    r0={this.state.r0}
                                    simNum={this.state.simNum}
                                    showConfBounds={this.state.showConfBounds}
                                    showActual={this.state.showActual}
                                    series={this.state.series}
                                    dates={this.state.dates}
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
                            <h5>Overlays</h5>
                            <Overlays 
                                showConfBounds={this.state.showConfBounds}
                                showActual={this.state.showActual}
                                onConfClick={this.handleConfClick}
                                onActualClick={this.handleActualClick}
                            />                        
                            <h5>Parameters</h5>
                            <p className="param-header">Severity</p>
                            <Severity 
                                severity={this.state.severity}
                                onSeverityClick={this.handleSeverityClick}
                            />
                            <Sliders 
                                onStatSliderChange={this.handleStatSliderChange}
                                onReprSliderChange={this.handleReprSliderChange}
                                onSimSliderChange={this.handleSimSliderChange}
                            />

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MainContainer;