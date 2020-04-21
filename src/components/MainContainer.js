import React, { Component } from 'react'
import Buttons from './Buttons.js';
import Graph from './Graph.js';
import Scenarios from './Scenarios.js';
import Severity from './Severity.js';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleScenarioClick = this.handleScenarioClick.bind(this);
        this.handleSeverityClick = this.handleSeverityClick.bind(this);
        this.state = {
            stat: 'Infections',
            geoid: '101',
            scenario: [],
            severity: '1% IFR, 10% hospitalization rate',
        };
    }

    handleButtonClick(i) {
        this.setState({stat: i})
    }

    handleScenarioClick(item) {
        if (this.state.scenario.includes(item)) {
            const scenarioCopy = this.state.scenario;
            const index = this.state.scenario.indexOf(item);
            if (index > -1) {
                scenarioCopy.splice(index, 1);
                this.setState({
                    scenario: scenarioCopy,
                })
            }

        } else {
            this.setState({
                scenario: this.state.scenario.concat(item)
            })
        }
        console.log(this.state.scenario)
    }

    handleSeverityClick(i) {
        this.setState({severity: i})
    }

    render() {
        return (
            <div className="main-container">
                <Buttons
                    stat={this.state.stat}
                    onButtonClick={this.handleButtonClick}
                    />
                <p></p>
                <div className="container no-margin">
                    <div className="row">
                        <div className="col-9">
                            <Graph 
                                stat={this.state.stat}
                                geoid={this.state.geoid}
                                scenario={this.state.scenario}
                                severity={this.state.severity}
                            />
                        </div>
                        <div className="col-3">
                            <h5>Scenarios</h5>
                            <Scenarios 
                                scenario={this.state.scenario}
                                onScenarioClick={this.handleScenarioClick}
                            />
                            <p></p>
                            <h5>Parameters</h5>
                            <h6>Severity</h6>
                            <Severity 
                                severity={this.state.severity}
                                onSeverityClick={this.handleSeverityClick}
                            />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MainContainer;