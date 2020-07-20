import React, { Component } from 'react';
import { Radio } from 'antd';
import TooltipHandler from '../Filters/TooltipHandler';
import _ from 'lodash';
import { LEVELS, styles } from '../../utils/constants.js';
import { capitalize } from '../../utils/utils.js';

class Severity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            showTooltip: false
        }
    }

    componentDidMount() {
        const children = [];
        const { existingSevs } = this.props;

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

    // TODO: add componentDidUpdate

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

    handleMouseEnter = (e) => {
        this.props.onSeverityHover(e);
    }

    handleMouseLeave= () => {
        this.props.onSeverityHoverLeave();
    }

    render() {
        const { severity, scenario, sevCount, isDisabled } = this.props; 
        const title = sevCount === 1 ?
            'SEVERITY' : ('Severity for ' + scenario.name.replace('USA_','')) ;
        return ( 
            <div
                onMouseEnter={() => this.handleMouseEnter(scenario.name)}
                onMouseLeave={() => this.handleMouseLeave(scenario.name)}>
                <div className="param-header">{title}
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                                High, medium, and low severity correspond
                                to 1%, 0.5%, and 0.25% infection fatality rate (IFR), 
                                and 10%, 5% and 2.5% hospitalization rate, respectively.      
                                <br /><br />
                                <i>Infections</i> values are the same across
                                all severity levels.               
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <Radio.Group
                    value={severity.key}  // TODO: do I need this?
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
