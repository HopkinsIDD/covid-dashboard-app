import React, { Component } from 'react';

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
        const levels = [
            {id: 1, name: '1% IFR, 10% hospitalization rate'}, 
            {id: 2, name: '0.5% IFR, 5% hospitalization rate'},
            {id: 3, name: '0.25% IFR, 2.5% hospitalization rate'},
        ]
        return (
            <div>
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" value="option_1" id="level_1"
                        onChange={() => this.handleChange(levels[0])} checked/>
                    <label className="form-check-label filter-text" htmlFor="level_1">
                    {levels[0].name}
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" value="option_2" id="level_2"
                        onChange={() => this.handleChange(levels[1])} />
                    <label className="form-check-label filter-text" htmlFor="level_2">
                    {levels[1].name}
                    </label>
                </div>                    
                <div className="form-check">
                    <input
                        className="form-check-input" type="radio" value="option_3" id="level_3"
                        onChange={() => this.handleChange(levels[2])} />
                    <label className="form-check-label filter-text" htmlFor="level_3">
                    {levels[2].name}
                    </label>
                </div>
            </div>
        )
    }
}

export default Severity