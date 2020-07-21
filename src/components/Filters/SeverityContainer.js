import React, { Component } from 'react';
import Severity from '../Filters/Severity';

class SeverityContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: []
        }
    }

    componentDidMount() {
        const child = this.buildSeverity(0);
        this.setState({ children: [child] })
    }

    componentDidUpdate(prevProp) {
        console.log('SeverityContainer componentDidUpdate')
        const { scenarioList, scenarioMap, severityList, stat } = this.props;
        const newChildren = [];


        if (prevProp.scenarioList !== scenarioList ||
            prevProp.scenarioMap !== scenarioMap ||
            prevProp.severityList !== severityList ||
            prevProp.stat !== stat ) {

            // console.log('prevProp.scenarioMap', prevProp.scenarioMap)
            // console.log('scenarioMap', scenarioMap)
            for (let i = 0; i < scenarioList.length; i++) {
                const child = this.buildSeverity(i);
                newChildren.push(child);
            }
            this.setState({ children: newChildren })    
            // console.log('newChildren!', newChildren)
        }
    }

    buildSeverity(i) {
        // console.log('buildingSeverity', i);
        const { scenarioList, scenarioMap, severityList, stat } = this.props;
        const keyVal = `${severityList[i].key}_${scenarioList[i].key}`;

        // Infection values are the same across all severity
        const isDisabled = stat.name === 'Infections' ? true : false;

        const child = {
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

    handleSeverityClick = (i) => {this.props.onSeveritiesClick(i)}

    handleSeverityHover = (i) => {this.props.onSeveritiesHover(i)}

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