import React, { Component } from 'react';
import { Select } from 'antd';

class Scenarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scenarioObj: [],
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const scenarioObj = Array.from(this.props.SCENARIOS);
        const { Option } = Select;

        for (let scenario of scenarioObj) {
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
            scenarioObj,
            children
        })
    }

    componentDidUpdate(prevProp) {
        
        if (prevProp.SCENARIOS !== this.props.SCENARIOS ||
            prevProp.scenarioList !== this.props.scenarioList ||
            prevProp.scenario !== this.props.scenario) {

            const { scenarioList } = this.props;

            const keys = Object.values(scenarioList).map(scen => scen.key);
            const scenarioObj = Array.from(this.props.SCENARIOS);
            
            if (this.props.scenarioList.length >= 2) {
                scenarioObj.map(scenario => {
                    if (keys.includes(scenario.key)) {
                        return scenario.disabled = false;
                    } else {
                        return scenario.disabled = true;
                        }
                  })
            } else {
                scenarioObj.map(scenario => {return scenario.disabled = false})
            }

            const children = [];
            const { Option } = Select;
    
            for (let scenario of scenarioObj) {
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
                scenarioObj,
                children
            })
        }
    }

    handleChange = (event) => {
        console.log('event', event)
        console.log('before', this.props.scenarioList.map(s => s.key))

        // prevent user from deselecting all scenarios
        if (event.length === 0) { return };

        // debugger;
        // const eventClicked = event[event.length -1];
        // const item = this.props.SCENARIOS.filter(s => s.key === eventClicked)[0];

        this.props.onScenarioClick(event);
    }

    render() {
        const defaultScenario = this.props.scenarioList[0].key;
        return (
            <div>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select 2 Max"
                    defaultValue={[defaultScenario]}
                    maxTagTextLength={12}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.checkbox)}
                </Select>
            </div>

        )
    }
}

export default Scenarios
