import React, { Component } from 'react';

class Overlays extends Component {

    handleConfClick = () => {
        this.props.onConfClick();
    }

    handleActualClick = () => {
        this.props.onActualClick();
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
                    <label className="form-check-label filter-label" htmlFor="defaultCheck1">
                        Show Confidence Bounds
                    </label>
                </div>
                {/* <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="defaultCheck1"
                        onClick={this.handleActualClick} />
                    <label className="form-check-label filter-label" htmlFor="defaultCheck1">
                        Show Actual Infections to Date
                    </label>
                </div> */}
            </div>

        )
    }
}

export default Overlays