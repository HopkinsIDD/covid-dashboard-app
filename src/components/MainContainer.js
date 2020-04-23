import React, { Component } from 'react'
import Graph from './Graph.js';
import Buttons from './Filters/Buttons.js';
import Scenarios from './Filters/Scenarios.js';
import Severity from './Filters/Severity.js';
import Sliders from './Filters/Sliders.js';
import Overlays from './Filters/Overlays.js';
import { utcParse } from 'd3-time-format'
import { STATOBJ } from '../store/constants.js';
const data = require('../store/geo06085.json')

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
            stat: 'Infections',
            geoid: '101',
            scenario: [],
            severity: '1% IFR, 10% hospitalization rate',
            r0: '1',
            simNum: '150',
            showConfBounds: false,
            showActual: false,
            data: {},
            dataLoaded: false,
        };
    }

    async componentDidMount() {
        console.log(data)
        const formatted = this.formatData(data)
        this.setState({ data: formatted }, () => { this.setState({ dataLoaded: true }) });
        // await this.fetchData('./geo06085.json')
    }

    formatData(data) {
        // console.log(data)
        const parseDate = utcParse("%Y-%m-%d")
        // console.log(data.series[STATOBJ[this.state.stat]])

        return {
            dates: data.dates.map( d => parseDate(d)),
            yAxisLabel: `Number of Daily ${this.state.stat} in ${this.state.geoid}`,
            series: data.series[STATOBJ[this.state.stat]].map( d => {
                // console.log(d)
                // console.log(Object.values(d))
                return Object.values(d).map( val => {
                    return {
                        name: val.name,
                        values: val.values.map( v => +v)
                    }
                })
            })
        }
    }

    handleButtonClick(i) {
        this.setState({stat: i})
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
        // console.log(this.state.dataLoaded, this.state.data)
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
                                data={this.state.data}
                            /> }
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