import React, { Component } from 'react';
import { LEVELS } from '../../store/constants.js';

class Severity extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(i) {
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
                            <label className="form-check-label filter-text">
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