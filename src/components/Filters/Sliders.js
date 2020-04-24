import React, { Component } from 'react';

class Sliders extends Component {
    // TODO: only allow to click on one severity checked 
    constructor(props) {
        super(props);
        this.handleStatChange = this.handleStatChange.bind(this);
        this.handleReprChange = this.handleReprChange.bind(this);
        this.handleSimChange = this.handleSimChange.bind(this);
    }
    
    handleStatChange(i) {
        this.props.onStatSliderChange(i);
    }

    handleReprChange(i) {
        this.props.onReprSliderChange(i);
    }

    handleSimChange(i) {
        this.props.onSimSliderChange(i);
    }

    render() {
        return (
            <div className="slider-menu">


                <p className="param-header">Stat Threshold</p>
                    <div className="slidecontainer">
                        <input
                            // TODO: min and max should be based on this.state.seriesRange
                            id="statThreshold" type="range" min="0" max="80000"
                            ref={ref => this.statInput = ref}
                            onChange={() => this.handleStatChange(this.statInput.value)}>
                        </input>
                    </div>

                <p className="param-header">Reproductive Number</p>
                <div className="slidecontainer">
                    <input
                        id="r0" type="range" min="0" max="4"
                        ref={ref => this.r0Input = ref}
                        onChange={() => this.handleReprChange(this.r0Input.value)}>
                    </input>
                </div>

                <p className="param-header">Number of Simulations</p>
                <div className="slidecontainer">
                    <input
                        id="simNum" type="range" min="1" max="1000"
                        ref={ref => this.simInput = ref}
                        onChange={() => this.handleSimChange(this.simInput.value)}>
                    </input>
                </div>
            </div>
        )
    }
}

export default Sliders