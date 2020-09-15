import React, { Component } from 'react';
import { Select } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { formatTitle } from '../../utils/utils';
import { styles } from '../../utils/constants';
import { Scenario } from "../../utils/constantsTypes";
import TooltipHandler from './TooltipHandler';


enum ScenariosModeEnum {
    chart = 'chart',
    map = 'map',
    graph = 'graph',
    multiple = 'multiple',
}

type ScenariosMode =
    ScenariosModeEnum.chart |
    ScenariosModeEnum.map |
    ScenariosModeEnum.graph |
    ScenariosModeEnum.multiple


interface Child {
    key: string,
    checkbox: Array<any> // FIXME any should be of type Option Component
}


interface Props {
    scenarioList: Array<Scenario>,
    view: ScenariosMode,
    SCENARIOS: Array<Scenario>,
    scenario: Scenario,
    onScenarioClick: (scenarioList: Array<Scenario>) => void,
    onScenarioClickChart: (scenarioList: Array<Scenario>) => void,
    onScenarioClickMap: (scenario: Scenario) => void
}

interface State {
    children: Array<Child>,
    showTooltip: boolean,
    scenariosGraph: Array<Scenario>
}

class Scenarios extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            scenariosGraph: [],
            showTooltip: false,
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const scenariosGraph = Array.from(this.props.SCENARIOS);
        const { Option } = Select;


        for (let scenario of scenariosGraph) {
            const child: Child = {
                key: scenario.key,
                checkbox: []
            };

            child.checkbox.push(
                // @ts-ignore value is not required
                <Option
                    key={scenario.key}>
                    {formatTitle(scenario.key)}
                </Option>
            );
            children.push(child);
        }

        this.setState({
            scenariosGraph,
            children,
        })
    }

    componentDidUpdate(prevProp: Props) {

        if (this.props.view === ScenariosModeEnum.graph) {
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
                });
                const children = [];
                const {Option} = Select;

                for (let scenario of scenariosGraph) {
                    const child: Child = {
                        key: scenario.key,
                        checkbox: []
                    };
                    child.checkbox.push(
                        // @ts-ignore value is not required
                        <Option
                            key={scenario.key}
                            disabled={scenario.disabled}
                        >
                            {formatTitle(scenario.key)}
                        </Option>
                    );
                    children.push(child);
                }
                this.setState({
                    scenariosGraph,
                    children
                })
            }
        } else if (this.props.view === ScenariosModeEnum.chart) {

            if (prevProp.SCENARIOS !== this.props.SCENARIOS ||
                prevProp.scenarioList !== this.props.scenarioList) {

                const children = [];
                const scenariosChart = Array.from(this.props.SCENARIOS);
                const {Option} = Select;

                for (let scenario of scenariosChart) {
                    const child: Child = {
                        key: scenario.key,
                        checkbox: []
                    };
                    child.checkbox.push(
                        // @ts-ignore value is not required
                        <Option
                            key={scenario.key}>
                            {formatTitle(scenario.key)}
                        </Option>
                    );
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

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    handleChange = (event: any) => { //FIXME Import TS for react-select
        // prevent user from deselecting all scenarios
        if (event.length === 0) {
            return
        }

        switch (this.props.view) {
            case ScenariosModeEnum.graph:
                this.props.onScenarioClick(event);
                break;
            case ScenariosModeEnum.chart:
                this.props.onScenarioClickChart(event);
                break;
            case ScenariosModeEnum.map:
                this.props.onScenarioClickMap(event);
                break;
        }
    };

    render() {
        let defaultScenario;
        let graphTags;
        switch (this.props.view) {
            case ScenariosModeEnum.graph:
                defaultScenario = [this.props.scenarioList[0].key];
                graphTags = this.props.scenarioList.map(s => s.key);
                break;
            case ScenariosModeEnum.chart:
                defaultScenario = this.props.SCENARIOS.map(s => s.name);
                graphTags = this.props.scenarioList;
                break;
            case ScenariosModeEnum.map:
                defaultScenario = [this.props.scenario];
                graphTags = defaultScenario;
                break;
        }

        return (
            <div>
                <div className="param-header">SCENARIOS
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">
                            &nbsp;<InfoCircleTwoTone />
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                                Scenarios are named for the model run date. 
                                This means that the model is calibrated only to ground truth data 
                                that was reported prior to the model run date.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <Select
                    mode={this.props.view === ScenariosModeEnum.map ? undefined : ScenariosModeEnum.multiple}
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
