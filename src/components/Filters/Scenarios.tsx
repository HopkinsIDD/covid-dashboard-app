import React, { Component } from 'react';
import { Select } from 'antd';
import { formatTitle } from '../../utils/utils';
import { styles } from '../../utils/constants';
import { Scenario, ScenarioList, ViewEnum, ViewType } from "../../utils/constantsTypes";

interface Child {
    key: string,
    checkbox: Array<any>
}


interface Props {
    scenarioList: ScenarioList,
    view: ViewType,
    SCENARIOS: ScenarioList,
    scenario: Scenario,
    onScenarioClick(scenarioList: ScenarioList): () => void,
    onScenarioClickChart(scenarioList: ScenarioList): () => void,
    onScenarioClickMap(scenario: Scenario): () => void
}

interface State {
    children: Array<any>,
    scenariosGraph: Array<any>
}

class Scenarios extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            scenariosGraph: [],
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const scenariosGraph = Array.from(this.props.SCENARIOS);
        const {Option} = Select;


        for (let scenario of scenariosGraph) {
            const child: Child = {
                key: scenario.key,
                checkbox: []
            }

            child.checkbox.push(
                // @ts-ignore value is not required
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

    componentDidUpdate(prevProp: Props) {

        if (this.props.view === ViewEnum.graph) {
            if (prevProp.SCENARIOS !== this.props.SCENARIOS ||
                prevProp.scenarioList !== this.props.scenarioList ||
                prevProp.scenario !== this.props.scenario) {
                const {scenarioList} = this.props;

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
                const {Option} = Select;

                for (let scenario of scenariosGraph) {
                    const child: Child = {
                        key: scenario.key,
                        checkbox: []
                    }
                    child.checkbox.push(
                        // @ts-ignore value is not required
                        <Option
                            key={scenario.key}
                            disabled={scenario.disabled}
                        >
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
        } else if (this.props.view === ViewEnum.chart) {

            if (prevProp.SCENARIOS !== this.props.SCENARIOS ||
                prevProp.scenarioList !== this.props.scenarioList) {

                const children = [];
                const scenariosChart = Array.from(this.props.SCENARIOS);
                const {Option} = Select;

                for (let scenario of scenariosChart) {
                    const child: Child = {
                        key: scenario.key,
                        checkbox: []
                    }
                    child.checkbox.push(
                        // @ts-ignore value is not required
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


    handleChange = (event: any) => { //FIXME Import TS for react-select
        // prevent user from deselecting all scenarios
        if (event.length === 0) {
            return
        }

        switch(this.props.view) {
            case ViewEnum.graph:
                this.props.onScenarioClick(event);
                break;
            case ViewEnum.chart:
                this.props.onScenarioClickChart(event);
                break;
            case ViewEnum.map:
                this.props.onScenarioClickMap(event);
                break;
        }
    };

    render() {
        let defaultScenario;
        let graphTags;
        switch(this.props.view) {
            case ViewEnum.graph:
                defaultScenario = [this.props.scenarioList[0].key];
                graphTags = this.props.scenarioList.map(s => s.key);
                break;
            case ViewEnum.chart:
                defaultScenario = this.props.SCENARIOS.map(s => s.name);
                graphTags = this.props.scenarioList;
                break;
            case ViewEnum.map:
                defaultScenario = [this.props.scenario];
                graphTags = defaultScenario;
                break;
        }

        return (
            <div>
                <div className="param-header">SCENARIOS</div>
                <Select
                    mode={this.props.view === ViewEnum.map ? undefined : ViewEnum.multiple}
                    style={styles.Selector}
                    defaultValue={defaultScenario}
                    value={graphTags}
                    maxTagTextLength={12}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.checkbox)}
                </Select>
            </div>
        )
    }
}

export default Scenarios
