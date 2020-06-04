import React, { Component } from 'react';
import { Select } from 'antd';
import { formatTitle } from '../../utils/utils';
import { styles } from '../../utils/constants';

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
        // console.log(scenariosGraph)
        const { Option } = Select;


        for (let scenario of scenariosGraph) {
            // console.log(`${view}-${scenario.key}`)
            const child = {
                key: scenario.key,
                checkbox: []
            } 
           
            child.checkbox.push(
                <Option
                    key={scenario.key}>
                    {formatTitle(scenario.key)}
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
                // console.log('graph scenario change')
                const { scenarioList } = this.props;
    
                const keys = Object.values(scenarioList).map(scen => scen.key);
                const scenariosGraph = Array.from(this.props.SCENARIOS);
                
                scenariosGraph.map(scenario => {
                    if (keys.includes(scenario.key) || scenarioList.length < 2) {
                        return scenario.disabled = false;
                    } else {
                        return scenario.disabled = true;
                        }
                })
                const children = [];
                const { Option } = Select;
        
                for (let scenario of scenariosGraph) {
                    const child = {
                        key: scenario.key,
                        checkbox: []
                    } 
                    // console.log(`${view}-${scenario.key}`)
                    child.checkbox.push(
                        <Option
                            key={scenario.key}
                            disabled={scenario.disabled}>
                            {formatTitle(scenario.key)}
                        </Option>
                    )
                    children.push(child);
                }
                this.setState({
                    scenariosGraph,
                    children
                })
            }
        } else if (this.props.view === 'chart') {

            if (prevProp.SCENARIOS !== this.props.SCENARIOS ||
                prevProp.scenarioList !== this.props.scenarioList) {

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
                            {formatTitle(scenario.key)}
                        </Option>
                    )
                    children.push(child);
                }
        
                this.setState({
                    children
                })
            }
        } else {
            if (prevProp.scenario !== this.props.scenario) {

            }
        }
    }

    handleChange = (event) => {
        // prevent user from deselecting all scenarios
        if (event.length === 0) { return };

        if (this.props.view === 'graph') {
            this.props.onScenarioClick(event);
        } else if (this.props.view === 'chart') {
            this.props.onScenarioClickChart(event)
        } else { // === 'map'
            this.props.onScenarioClickMap(event)
        }
    }

    render() {
        let defaultScenario;
        let graphTags;
        if (this.props.view === 'graph') {
            defaultScenario = [this.props.scenarioList[0].key];
            graphTags = this.props.scenarioList.map( s => s.key )
        } else if (this.props.view === 'chart') {
            defaultScenario = this.props.SCENARIOS.map(s => s.name);
            graphTags = this.props.scenarioList
        } else { // === 'map'
            defaultScenario = [this.props.scenario]
            graphTags = defaultScenario
        }
        
        return (
            <div>
                <div className="param-header">SCENARIOS</div>
                <Select
                    mode={this.props.view === 'map' ? "" : "multiple"}
                    style={styles.Selector}
                    defaultValue={defaultScenario}
                    value={graphTags}
                    maxTagTextLength={16}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.checkbox)}
                </Select>
            </div>
        )
    }
}

export default Scenarios
