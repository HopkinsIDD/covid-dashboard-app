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

    render() {
        const { severity, scenario } = this.props;
        return ( 
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}>
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
            
        )
    }
}

export default Severity