import React, { Component } from 'react';
import _ from 'lodash';
import { LEVELS } from '../../utils/constants.js';

class Severity extends Component {
    handleChange = (item) => {
        // add scenario to obj so MainContainer knows which scenario is active
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
            ('Severity for ' + scenario.name.replace('_',' ')) : 'Severity';
        return ( 
            <div
                onMouseEnter={() => this.handleMouseEnter(scenario.name)}
                onMouseLeave={() => this.handleMouseLeave(scenario.name)}>
                <div className="param-header">{title}
                    <div className="tooltip">&nbsp;&#9432;
                        <span className="tooltip-text">
                        There are three levels of severity (high, medium, 
                        low) based on Infection-fatality-ratio (IFR) and 
                        hospitalization rate.
                        </span>
                    </div>
                </div>
                <div>
                    {LEVELS.map(level => {
                        const isActive = (severity.key === level.key
                            && severity.scenario === scenario.key) ? 'checked' : '';
                        return (
                            <div
                                className="form-check"
                                key={level.id}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`${level.key}-${scenario.key}`}
                                    id={`${level.key}-${scenario.key}`}
                                    onChange={() => this.handleChange(level)} 
                                    checked={isActive}
                                    />
                                <label
                                    className="form-check-label filter-label"
                                    htmlFor={`${level.key}-${scenario.key}`}>
                                    {level.name}
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>
            
        )
    }
}

export default Severity