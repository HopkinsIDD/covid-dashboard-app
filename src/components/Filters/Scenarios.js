import React, { Component } from 'react';
import { Select } from 'antd';

class Scenarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scenariosGraph: [],
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const scenariosGraph = Array.from(this.props.SCENARIOS);
        const { Option } = Select;

        for (let scenario of scenariosGraph) {
            const child = {
                key: scenario.key,
                checkbox: []
            } 
            child.checkbox.push(
                <Option
                    key={scenario.key}>
                    {scenario.key.replace('USA_','')}
                </Option>
            )
            children.push(child);
        }

        this.setState({
            scenariosGraph,
            children,
        })
    }

    componentDidUpdate(prevProp) {

        if (this.props.view === 'graph') {
            
            if (prevProp.SCENARIOS !== this.props.SCENARIOS ||
                prevProp.scenarioList !== this.props.scenarioList ||
                prevProp.scenario !== this.props.scenario) {
    
                const { scenarioList } = this.props;
    
                const keys = Object.values(scenarioList).map(scen => scen.key);
                const scenariosGraph = Array.from(this.props.SCENARIOS);
                
                if (this.props.scenarioList.length >= 2) {
                    scenariosGraph.map(scenario => {
                        if (keys.includes(scenario.key)) {
                            return scenario.disabled = false;
                        } else {
                            return scenario.disabled = true;
                            }
                      })
                } else {
                    scenariosGraph.map(scenario => {return scenario.disabled = false})
                }
    
                const children = [];
                const { Option } = Select;
        
                for (let scenario of scenariosGraph) {
                    const child = {
                        key: scenario.key,
                        checkbox: []
                    } 
                    child.checkbox.push(
                        <Option
                            key={scenario.key}
                            disabled={scenario.disabled}>
                            {scenario.key.replace('USA_','')}
                        </Option>
                    )
                    children.push(child);
                }
                this.setState({
                    scenariosGraph,
                    children
                })
            }
        } else {

            if (prevProp.SCENARIOS !== this.props.SCENARIOS) {

                const children = [];
                const scenariosChart = Array.from(this.props.SCENARIOS);
                const { Option } = Select;
        
                for (let scenario of scenariosChart) {
                    const child = {
                        key: scenario.key,
                        checkbox: []
                    } 
                    child.checkbox.push(
                        <Option
                            key={scenario.key}>
                            {scenario.key.replace('USA_','')}
                        </Option>
                    )
                    children.push(child);
                }
        
                this.setState({
                    children
                })
            }
        }
    }

    handleChange = (event) => {
        // prevent user from deselecting all scenarios
        if (event.length === 0) { return };

        if (this.props.view === 'graph') {
            this.props.onScenarioClick(event);
        } else {
            this.props.onScenarioClickChart(event)
        }
    }

    render() {
        let defaultScenario;
        if (this.props.view === 'graph') {
            defaultScenario = [this.props.scenarioList[0].key];
        } else {
            defaultScenario = this.props.SCENARIOS.map(s => s.name);
        }
        return (
            <div>
                <div className="param-header">SCENARIOS</div>
                <Select
                    mode="multiple"
                    style={{ width: '70%' }}
                    defaultValue={defaultScenario}
                    maxTagTextLength={12}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.checkbox)}
                </Select>
            </div>
        )
    }
}

export default Scenarios
