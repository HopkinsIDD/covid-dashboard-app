import React, { Component } from 'react';
import Severity from '../Filters/Severity';
import { Scenario, ScenarioList, SeverityLevelList, Stat } from "../../utils/constantsTypes";

interface Child {
    key: string,
    scenario: Scenario,
    severity: Array<any>, //FIXME how to type a component
}

interface Props {
    scenarioList: ScenarioList,
    severityList: SeverityLevelList,
    scenarioMap: Array<any>, //FIXME ScenarioMap dict
    stat: Stat,
    onSeveritiesClick: (i: Child) => void,
    onSeveritiesHover: (i: string) => void,
    onSeveritiesHoverLeave: () => void,
}

interface State {
    children: Array<Child>,
}

class SeverityContainer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            children: []
        }
    }

    componentDidMount() {
        const child = this.buildSeverity(0);
        this.setState({ children: [child] })
    }

    componentDidUpdate(prevProp: Props) {
        const { scenarioList, scenarioMap, severityList, stat } = this.props;
        const newChildren = [];

        if (prevProp.scenarioList !== scenarioList ||
            prevProp.scenarioMap !== scenarioMap ||
            prevProp.severityList !== severityList ||
            prevProp.stat !== stat ) {

            for (let i = 0; i < scenarioList.length; i++) {
                const child = this.buildSeverity(i);
                newChildren.push(child);
            }
            this.setState({ children: newChildren })
        }
    }

    buildSeverity(i: number) {
        const { scenarioList, scenarioMap, severityList, stat } = this.props;
        const keyVal = `${severityList[i].key}_${scenarioList[i].key}`;

        // Infection values are the same across all severity
        const isDisabled = stat.name === 'Infections' ? true : false;

        const child: Child = {
            'key': keyVal,
            'scenario': scenarioList[i],
            'severity': []
        }
        child.severity.push(
            <Severity
                key={keyVal}
                severity={severityList[i]} 
                scenario={scenarioList[i]}
                existingSevs={scenarioMap[scenarioList[i].key]}  // array of sev levels
                isDisabled={isDisabled}
                sevCount={severityList.length}
                onSeverityClick={this.handleSeverityClick}
                onSeverityHover={this.handleSeverityHover}
                onSeverityHoverLeave={this.handleSeverityHoverLeave}
            />
        )
        return child;
    }

    handleSeverityClick = (i: Child) => {this.props.onSeveritiesClick(i)}

    handleSeverityHover = (i: string) => {this.props.onSeveritiesHover(i)}

    handleSeverityHoverLeave = () => {this.props.onSeveritiesHoverLeave()}

    render() {
        const { children } = this.state;
        return (
            <div>
                {children.map(child => {
                    return (
                        <div key={child.key}>
                            {child.severity}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default SeverityContainer