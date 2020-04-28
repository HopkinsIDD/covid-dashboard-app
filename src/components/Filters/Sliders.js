import React, { Component } from 'react';
import { addCommas } from '../../utils/utils.js';

class Sliders extends Component {
    handleStatChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleReprChange = (i) => {
        this.props.onReprSliderChange(i);
    }

    render() {
        const { stat, statThreshold, seriesMin, seriesMax } = this.props;
        const roundedStat = Math.ceil(statThreshold / 100) * 100;
        return (
            <div className="slider-menu">
                <p className="filter-label">
                    {stat.name} Threshold: {addCommas(roundedStat)}
                </p>
                    <div className="slidecontainer">
                        <input
                            id="statThreshold"
                            className="slider"
                            type="range"
                            min={seriesMin.toString()}
                            max={seriesMax.toString()}
                            value={statThreshold.toString()}
                            ref={ref => this.statInput = ref}
                            onChange={
                                () => {this.handleStatChange(this.statInput.value)}
                            }>
                        </input>
                        <div className="row slider-label">
                            <p className="col-6 filter-label">
                                {addCommas(seriesMin)}
                            </p>
                            <p className="col-6 filter-label slider-max">
                                {addCommas(seriesMax)}
                            </p>
                        </div>
                    </div>
{/*             <p className="param-header">Reproductive Number</p>
                <div className="slidecontainer">
                    <input
                        id="r0" type="range" min="0" max="4"
                        ref={ref => this.r0Input = ref}
                        onChange={() => this.handleReprChange(this.r0Input.value)}>
                    </input>
                </div> */}

            </div>
        )
    }
}

export default Sliders