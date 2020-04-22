import React, { Component } from 'react';

class Overlays extends Component {
    constructor(props) {
        super(props);
        this.handleConfClick = this.handleConfClick.bind(this);
        this.handleActualClick = this.handleActualClick.bind(this);
    }
    
    handleConfClick(i) {
        this.props.onConfClick(i);
    }

    handleActualClick(i) {
        this.props.onActualClick(i);
    }

    render() {
        return (          
            <div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="defaultCheck1"
                        onClick={this.handleConfClick} />
                    <label className="form-check-label filter-text" htmlFor="defaultCheck1">
                        Show Confidence Boundaries
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="defaultCheck1"
                        onClick={this.handleActualClick} />
                    <label className="form-check-label filter-text" htmlFor="defaultCheck1">
                        Show Actual Infections to Date
                    </label>
                </div>
            </div>

        )
    }
}

export default Overlays