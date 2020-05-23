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
            'sevCount': 1,
        }
        child.severity.push(
            <Severity 
                key={keyVal}
                severity={severityList[0]}
                scenario={scenarioList[0]}
                sevCount={severityList.length}
                onSeverityClick={this.handleSeverityClick}
                onSeverityHover={this.handleSeverityHover}
                onSeverityHoverLeave={this.handleSeverityHoverLeave}
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
                        sevCount={severityList.length}
                        onSeverityClick={this.handleSeverityClick}
                        onSeverityHover={this.handleSeverityHover}
                        onSeverityHoverLeave={this.handleSeverityHoverLeave}
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
        this.props.onSeveritiesClick(i);
    }

    handleSeverityHover = (i) => {
        this.props.onSeveritiesHover(i);
    }

    handleSeverityHoverLeave = () => {
        this.props.onSeveritiesHoverLeave();
    }

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