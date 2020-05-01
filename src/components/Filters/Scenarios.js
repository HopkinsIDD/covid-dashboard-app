import React, { Component } from 'react';
import { SCENARIOS } from '../../utils/constants.js';

class Scenarios extends Component {
    handleClick = (i) => {
        this.props.onScenarioClick(i);
    }

    render() {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-light dropdown-toggle btn-stat filter-label"
                    type="button" 
                    id="dropdownMenu2" 
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="false">
                    Select Scenarios
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                    {SCENARIOS.map(scenario => {
                        const isEqual = scenario.key === this.props.scenario.key;
                        const isActive = isEqual ? ' active' : '';
                        return <button
                                    className={"dropdown-item filter-label" + isActive}
                                    type="button" 
                                    onClick={() => this.handleClick(scenario)} 
                                    key={scenario.id}>
                                    {scenario.name}
                                </button>
                    })}
                </div>
            </div>
        )
    }
}

export default Scenarios