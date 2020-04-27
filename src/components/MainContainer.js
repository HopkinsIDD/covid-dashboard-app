import React, { Component } from 'react'
import Graph from './Graph.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
import Overlays from './Filters/Overlays.js';
import { utcParse } from 'd3-time-format'
const dataset = require('../store/geo06085.json');

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
            dates: [],
            yAxisLabel: '',
            stat: {'id': 1, 'name': 'Infections', 'key': 'incidI'},
            geoid: '101',
            scenario: {'id': 1, 'key': 'USA_Uncontrolled', 'name': 'USA_Uncontrolled'},
            severity: {'id': 1, 'key': 'high', 'name': '1% IFR, 10% hospitalization rate'}, 
            statThreshold: null,
            r0: '1',
            simNum: '150',
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
        };
    };

    async componentDidMount() {
        const initialData = dataset[this.state.scenario.key][this.state.severity.key];
        const parseDate = utcParse("%Y-%m-%d");
        const dates = initialData.dates.map( d => parseDate(d));
        const series = initialData.series[this.state.stat.key];
        series.map(sim => sim['over'] = false);
        const yAxisLabel = `Number of Daily ${this.state.stat.name} in ${this.state.geoid}`;
        
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        this.setState({
            dataset,
            dates,
            series,
            yAxisLabel,
            graphW,
            graphH
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    };

    updateSeries(scenario, stat, severity, dataThreshold) {
        const newSeries = Array.from(this.state.dataset[scenario.key][severity.key].series[stat.key]);
        if (dataThreshold) {
            newSeries.forEach(sim => {
                if (Math.max.apply(null, sim.vals) > dataThreshold) {
                  return sim.over = true;
                } else {
                    return sim.over = false;
                }
               });
        };
        return newSeries;
    }

    handleButtonClick(i) {
        const yAxisLabel = `Number of Daily ${i.name} in ${this.state.geoid}`;
        const series = this.updateSeries(this.state.scenario, i, this.state.severity, this.state.dataThreshold);
        this.setState({
            stat: i,
            series,
            yAxisLabel
        })
    }

    handleScenarioClick(i) {
        const series = this.updateSeries(i, this.state.stat, this.state.severity, this.state.dataThreshold);
        this.setState({
            scenario: i,
            series
        })
        // TODO: for handling multiple scenarios toggled
        //     if (this.state.scenario.includes(i)) {
        //     const scenarioCopy = Array.from(this.state.scenario);
        //     const index = this.state.scenario.indexOf(item);
        //     if (index > -1) {
        //         scenarioCopy.splice(index, 1);
        //         this.setState({
        //             scenario: scenarioCopy,
        //         })
        //     };

        // } else {
        //     this.setState({
        //         scenario: this.state.scenario.concat(item)
        //     });
        // }
    }

    handleSeverityClick(i) {
        const series = this.updateSeries(this.state.scenario, this.state.stat, i, this.state.dataThreshold);
        this.setState({
            severity: i,
            series,
        });
    }

    handleStatSliderChange(i) {
        const series = this.updateSeries(this.state.scenario, this.state.stat, this.state.severity, i);
        this.setState({
            series,
            statThreshold: +i, 
        });
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