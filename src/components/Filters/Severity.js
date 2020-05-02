import React, { Component } from 'react';
import { LEVELS } from '../../utils/constants.js';

class Severity extends Component {
    handleChange = (i) => {
        this.props.onSeverityClick(i);
    }

    render() {
        return (
            <div>
                {LEVELS.map(level => {
                    const isActive = (level.key === this.props.severity.key) ? 'checked' : '';
                    return (
                        <div className="form-check" key={level.id}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="sev"
                                onChange={() => this.handleChange(level)} 
                                checked={isActive}/>
                            <label className="form-check-label filter-label">
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