import React, { Component } from 'react';
import { Radio } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import TooltipHandler from '../Filters/TooltipHandler';
import _ from 'lodash';
import { LEVELS, styles } from '../../utils/constants.js';
import { capitalize, formatTitle } from '../../utils/utils.js';

class Severity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            showTooltip: false
        }
    }

    componentDidMount() {
        const { existingSevs } = this.props;
        this.initialize(existingSevs);
    }

    componentDidUpdate(prevProp) {
        const { existingSevs } = this.props;
        if (prevProp.existingSevs !== existingSevs ) {
            this.initialize(existingSevs);
        }
    }

    initialize = (existingSevs) => {
        const children = [];
    
        for (let level of LEVELS) {
            const child = {
                key: `${level.key}-severity`,
                button: []
            } 
            child.button.push(
                <Radio.Button
                    key={`${level.key}-severity`}
                    // disable radio button if severity level does not exist
                    disabled={!existingSevs.includes(level.key)}
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

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    handleMouseEnter = (e) => {this.props.onSeverityHover(e)}

    handleMouseLeave= () => {this.props.onSeverityHoverLeave()}

    render() {
        const { severity, scenario, sevCount, isDisabled } = this.props; 
        const title = sevCount === 1 ?
            'SEVERITY' : ('Severity for ' + formatTitle(scenario.name));
        return ( 
            <div
                onMouseEnter={() => this.handleMouseEnter(scenario.name)}
                onMouseLeave={() => this.handleMouseLeave(scenario.name)}>
                <div className="param-header">{title}
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">
                            &nbsp;<InfoCircleTwoTone />
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                            The high, medium, and low severity labels correspond 
                            to 1%, 0.5%, and 0.25% infection fatality ratios (IFR), 
                            and 10%, 5% and 2.5% hospitalization rates, respectively. 
                            Note that models are simulated independently for each severity level, 
                            even for the same model scenario.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <Radio.Group
                    value={severity.key} 
                    style={styles.Severity}
                    disabled={isDisabled}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.button)}
                </Radio.Group>
            </div>
        )
    }
}

export default Severity
