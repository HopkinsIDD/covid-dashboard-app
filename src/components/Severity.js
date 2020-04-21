import React, { Component } from 'react';

class Severity extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(i) {
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
            levels.map(severity => {
                return (
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            value=""
                            id="defaultCheck1"
                            onClick={() => this.handleClick(severity)}
                            key={severity.id} />
                        <label className="form-check-label filter-text" htmlFor="defaultCheck1">
                            {severity.name}
                        </label>
                    </div>
                )
            })
        )
    }
}

export default Severity