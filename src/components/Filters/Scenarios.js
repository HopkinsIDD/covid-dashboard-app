import React, { Component } from 'react';
import { SCENARIOS } from '../../store/constants.js';

class Scenarios extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(i) {
        this.props.onScenarioClick(i.name);
    }

    render() {
        return (          
            SCENARIOS.map(scenario => {
                return (
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                            onClick={() => this.handleClick(scenario)}
                            key={scenario.id} />
                        <label className="form-check-label filter-text" htmlFor="defaultCheck1">
                            {scenario.name}
                        </label>
                    </div>
                )
            })
        )
    }
}

export default Scenarios