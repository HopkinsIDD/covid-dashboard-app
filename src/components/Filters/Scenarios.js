import React, { Component } from 'react';
import { SCENARIOS } from '../../utils/constants.js';
import { parseJsonSourceFileConfigFileContent } from 'typescript';

// TODO: Warning: A component is changing an uncontrolled input of type checkbox 
// to be controlled. Input elements should not switch from uncontrolled to controlled
// Component should be fully controlled.
class Scenarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currScenario: {},
            scenariosObj: SCENARIOS
        }
    }

    componentDidMount() {
        console.log('scenarios componentDidMount')
        const obj = Array.from(this.state.scenariosObj)

        // update checked attribute for active scenario
        obj.map(scenario => {
            if (scenario.key === this.props.scenario.key) {
                return scenario.checked = true;
            } else {
                return scenario.checked = false;
            }
        })
        // add disable=false attribute
        obj.map(scenario => {return scenario.disabled = false})

        this.setState({
            scenariosObj: obj,
            currScenario: this.props.scenario
        })
    }

    componentDidUpdate(prevProp) {
        const { scenarioList } = this.props;
        if (prevProp.scenarioList !== this.props.scenarioList ||
            prevProp.scenario !== this.props.scenario) {
            const keys = Object.values(scenarioList).map(scen => scen.key);
            const obj = Array.from(this.state.scenariosObj)

            // update checked attribute for active scenario
            obj.map(scenario => {
                if (keys.includes(scenario.key)) {
                    return scenario.checked = true;
                } else {
                    return scenario.checked = false;
                }
            })
            // set disable attribute to false if required
            if (this.props.scenarioList.length >= 2) {
                obj.map(scenario => {
                    if (keys.includes(scenario.key)) {
                        return scenario.disabled = false;
                    } else {
                        return scenario.disabled = true;
                        }
                  })
            } else {
                obj.map(scenario => {return scenario.disabled = false})
            }

            this.setState({
                scenariosObj: obj
            })
        }
    }

    handleClick = (event) => {
        if (this.props.scenarioList.length === 1 && event.key === this.props.scenario.key) {
            const x = 'do nothing';
        } else {
            console.log('handleClick', event)
            this.props.onScenarioClick(event);
        }
    }

    render() {
        return (
            this.state.scenariosObj.map(scenario => {
                return (
                    <div
                        className="form-check"
                        key={scenario.key}>
                        <input
                            className={"form-check-input"}
                            type="checkbox"
                            id="scenario"
                            onChange={() => this.handleClick(scenario)}
                            disabled={scenario.disabled}
                            checked={scenario.checked}
                            >
                        </input>
                        <label
                            className="form-check-label filter-label"
                            htmlFor="scenario"
                            >
                            {scenario.name.replace('_',' ')}
                        </label>
                    </div>
                )
            })
        )
    }
}

export default Scenarios
