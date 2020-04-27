import React, { Component } from 'react'
import Graph from './Graph.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
// import Overlays from './Filters/Overlays.js';
import { getRange, updateThresholdFlag } from '../utils/utils.js'
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
        this.handleConfClick = this.handleConfClick.bind(this);
        this.handleActualClick = this.handleActualClick.bind(this);
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
            r0: '1',
            simNum: '150',
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
        };
    };

    async componentDidMount() {
        const { scenario, severity, geoid, stat } = this.state;
        const initialData = dataset[scenario.key][severity.key];
        const series = initialData.series[stat.key];
        const parseDate = utcParse("%Y-%m-%d");
        const dates = initialData.dates.map( d => parseDate(d));
        
        const [seriesMin, seriesMax] = getRange(series);
        const statThreshold = Math.ceil((seriesMax / 1.2) / 100) * 100;
        updateThresholdFlag(series, statThreshold);
        
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
            graphW,
            graphH
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    };

    updateSeries(scenario, stat, severity) {
        const { dataset } = this.state;
        const newSeries = Array.from(
            dataset[scenario.key][severity.key].series[stat.key]
            );
        this.setState({
            series: newSeries
        })
    };
    
    updateThreshold(series) {
        const [seriesMin, seriesMax] = getRange(series);
        const statThreshold = Math.ceil((seriesMax / 1.2) / 100) * 100;
        updateThresholdFlag(series, statThreshold);
        console.log('updateSeries statThreshold', this.state.statThreshold)

        this.setState({
            statThreshold,
            seriesMin,
            seriesMax
        })
    };
    
    handleButtonClick(i) {
        const { geoid, scenario, severity} = this.state;
        const yAxisLabel = `Number of Daily ${i.name} in ${geoid}`;
        // TODO: ALTERNATIVELY, updateSeries can return a Series, then set
        // to state here, and then on callback, call updateThreshold
        this.updateSeries(scenario, i, severity, () => {
            this.updateThreshold(this.state.series)
        });
        this.setState({
            stat: i,
            yAxisLabel
        })
    };

    handleScenarioClick(i) {
        const { stat, severity} = this.state;
        this.updateSeries(i, stat, severity);
        this.setState({
            scenario: i,
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
        const { scenario, stat} = this.state;
        this.updateSeries(scenario, stat, i);
        this.setState({
            severity: i,
        });
    }

    handleStatSliderChange(i) {
        console.log('MainContainer', i)
        const { scenario, stat, severity } = this.state;
        const rounded = Math.ceil(i / 100) * 100;

        this.setState({
            statThreshold: +rounded, 
        }, () => {
            this.updateSeries(scenario, stat, severity, i, this.state.statThreshold);
        });
    }

    handleReprSliderChange(i) {
        this.setState({r0: i});
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

                            <p className="filter-text scenario-title">
                                {this.state.scenario.name}
                            </p>
                            <div
                                className="graph border"
                                ref={ (graphEl) => { this.graphEl = graphEl } }
                                >
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