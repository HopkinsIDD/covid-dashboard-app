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
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" name="sev"
                        onChange={() => this.handleChange(LEVELS[0])} />
                    <label className="form-check-label filter-text">
                    {LEVELS[0].name}
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" name="sev"
                        onChange={() => this.handleChange(LEVELS[1])} />
                    <label className="form-check-label filter-text">
                    {LEVELS[1].name}
                    </label>
                </div>                    
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" name="sev"
                        onChange={() => this.handleChange(LEVELS[2])} />
                    <label className="form-check-label filter-text">
                    {LEVELS[2].name}
                    </label>
                </div>
            </div>
        )
    }
}

export default Severity