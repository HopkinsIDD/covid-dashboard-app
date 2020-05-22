import React, { Component } from 'react';
import { Radio } from 'antd';
import _ from 'lodash';
import { LEVELS } from '../../utils/constants.js';
import { capitalize } from '../../utils/utils.js';

class Severity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
        }
    }

    componentDidMount() {
        const children = [];
        for (let level of LEVELS) {
            const child = {
                key: `${level.key}-severity`,
                button: []
            } 
            child.button.push(
                <Radio.Button
                    key={`${level.key}-severity`}
                    value={level.key}>{capitalize(level.key)}
                </Radio.Button>
            )
            children.push(child);
        }

        this.setState({children})
    }

    handleChange = (e) => {
        // add scenario to obj so MainContainer knows which scenario is active
        const item = LEVELS.filter(level => level.key === e.target.value)[0];
        const itemClone = _.assign({}, item, {
            scenario: this.props.scenario.key
        });
        this.props.onSeverityClick(itemClone);
    }

    handleMouseEnter = (e) => {
        this.props.onSeverityHover(e);
    }

    handleMouseLeave= () => {
        this.props.onSeverityHoverLeave();
    }

    render() {
        const { severity, scenario, sevCount } = this.props; 
        const title = sevCount === 2 ?
            ('SEVERITY: ' + scenario.name.replace('USA_','')) : 'SEVERITY';
        return ( 
            <div
                onMouseEnter={() => this.handleMouseEnter(scenario.name)}
                onMouseLeave={() => this.handleMouseLeave(scenario.name)}>
                <div className="param-header">{title}</div>
                <Radio.Group
                    value={severity.key} 
                    style={{ width: '80%' }}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.button)}
                </Radio.Group>
            </div>
        )
    }
}

export default Severity
