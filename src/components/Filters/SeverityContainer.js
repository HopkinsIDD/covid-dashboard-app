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
        const { scenarioList, severityList } = this.props;
        const keyVal = `${severityList[0].key}_${scenarioList[0].key}`;
        const child = {
            'key': keyVal,
            'scenario': scenarioList[0],
            'severity': [],
        }
        child.severity.push(
            <Severity 
                key={keyVal}
                severity={severityList[0]}
                scenario={scenarioList[0]}
                onSeverityClick={this.handleSeverityClick}
            />        
        )
        this.setState({
            children: [child],
        })
    }

    componentDidUpdate(prevProp, prevState) {
        const { scenarioList, severityList } = this.props;
        const newChildren = [];

        if (prevProp.scenarioList !== scenarioList ||
            prevProp.severityList !== severityList ) {
            console.log('severityContainer didUpdate')

            for (let i = 0; i < scenarioList.length; i++) {
                const keyVal = `${severityList[i].key}_${scenarioList[i].key}`;
                const child = {
                    'key': keyVal,
                    'scenario': scenarioList[i],
                    'severity': [],
                }
                child.severity.push(
                    <Severity 
                        key={keyVal}
                        severity={severityList[i]}
                        scenario={scenarioList[i]}
                        onSeverityClick={this.handleSeverityClick}
                    />
                )
                newChildren.push(child);
            }
            this.setState({
                children: newChildren,
            })    
        }
    }

    handleSeverityClick = (i) => {
        console.log('in SevContainer', i)
        this.props.onSeveritiesClick(i);
    }

    render() {
        const { children } = this.state;
        const { scenarioList } = this.props;
        return (
            <div>
                {children.map(child => {
                    const title = scenarioList.length === 2 ?
                        ('Severity for ' + child.scenario.name.replace('_',' ')) : 'Severity';
                    return (
                        <div key={child.key}>
                            <div className="param-header">{title}
                                <div className="tooltip">&nbsp;&#9432;
                                    <span className="tooltip-text">
                                    There are three levels of severity (high, medium, 
                                    low) based on Infection-fatality-ratio (IFR) and 
                                    hospitalization rate.
                                    </span>
                                </div>
                            </div>
                            <div key={child.key}>
                                {child.severity}
                            </div>
                        </div>
                    )
                })}
            </div>
            
        )
    }
}

export default SeverityContainer