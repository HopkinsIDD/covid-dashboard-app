import React, { Component } from 'react'
import Buttons from './Buttons.js';
import Graph from './Graph.js';
import Scenarios from './Scenarios.js';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleScenarioClick = this.handleScenarioClick.bind(this);
        this.state = {
            stat: 'Infections',
            geoid: '101',
            scenario: [],
        };
    }

    handleButtonClick(i) {
        this.setState({stat: i})
        console.log(this.state.stat)
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
                            />
                        </div>
                        <div className="col-3">
                            <Scenarios 
                                scenario={this.state.scenario}
                                onScenarioClick={this.handleScenarioClick}
                            />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MainContainer;