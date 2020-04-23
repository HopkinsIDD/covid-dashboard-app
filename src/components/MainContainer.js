import React, { Component } from 'react'
import Graph from './Graph.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
import Overlays from './Filters/Overlays.js';
import { utcParse } from 'd3-time-format'
import { STATOBJ } from '../store/constants.js';
const dataset = require('../store/geo06085.json')


class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleScenarioClick = this.handleScenarioClick.bind(this);
        this.handleSeverityClick = this.handleSeverityClick.bind(this);
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
            scenario: [],
            severity: '1% IFR, 10% hospitalization rate',
            r0: '1',
            simNum: '150',
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
        };
    }

    async componentDidMount() {
        const parseDate = utcParse("%Y-%m-%d");
        const dates = dataset.dates.map( d => parseDate(d));
        const yAxisLabel = `Number of Daily ${this.state.stat} in ${this.state.geoid}`;
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;
        const series = dataset.series[STATOBJ[this.state.stat]].map( d => {
            return Object.values(d).map( val => {
                return {
                    name: val.name,
                    values: val.values.map( v => +v)
                }
            })
        });
        const seriesMax = Math.max.apply(null, series[0][1].values);

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
        const series = dataset.series[STATOBJ[i]].map( d => {
            return Object.values(d).map( val => {
                return {
                    name: val.name,
                    values: val.values.map( v => +v)
                }
            })
        });
        const seriesMax = Math.max.apply(null, series[0][1].values);
        this.setState({
            stat: i,
            series,
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
        console.log(this.state.scenario)
    }

    handleSeverityClick(i) {
        this.setState({severity: i});
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