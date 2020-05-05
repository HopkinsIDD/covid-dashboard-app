import React, { Component } from 'react';
import { SCENARIOS } from '../../utils/constants.js';

class Scenarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currScenario: {},
            scenariosObj: SCENARIOS,
            value: this.props.scenario.name,
        }
    }

    componentDidMount() {
        const obj = Array.from(this.state.scenariosObj)

        // update checked attribute for active scenario
        obj.map(scenario => {
            if (scenario.key === this.props.scenario.key) {
                return scenario.checked = true;
            } else {
                return scenario.checked = false;
            }
        })

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
        const { scenario, scenarioList } = this.props;
        if (scenarioList.length === 1 && event.key === scenario.key) {
            return;
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
                        value={scenario.key}
                        key={scenario.key}>
                        <input
                            className={"form-check-input"}
                            type="checkbox"
                            id="scenario"
                            value={scenario.key}
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
