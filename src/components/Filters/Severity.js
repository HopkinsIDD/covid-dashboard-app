import React, { Component } from 'react';
import { LEVELS } from '../../store/constants.js';

class Severity extends Component {
    // TODO: only allow to click on one severity checked 
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(i) {
        console.log('inside severity', i)
        this.props.onSeverityClick(i.name);
    }

    render() {
        return (
            <div>
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" value="option_1" id="level_1"
                        onChange={() => this.handleChange(LEVELS[0])} checked/>
                    <label className="form-check-label filter-text" htmlFor="level_1">
                    {LEVELS[0].name}
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" value="option_2" id="level_2"
                        onChange={() => this.handleChange(LEVELS[1])} />
                    <label className="form-check-label filter-text" htmlFor="level_2">
                    {LEVELS[1].name}
                    </label>
                </div>                    
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" value="option_3" id="level_3"
                        onChange={() => this.handleChange(LEVELS[2])} />
                    <label className="form-check-label filter-text" htmlFor="level_3">
                    {LEVELS[2].name}
                    </label>
                </div>
            </div>
        )
    }
}

export default Severity