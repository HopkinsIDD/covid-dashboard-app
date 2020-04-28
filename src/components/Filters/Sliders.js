import React, { Component } from 'react';
import { addCommas, readableDate } from '../../utils/utils.js';

class Sliders extends Component {
    handleStatChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateChange = (e) => {
        console.log('date', e.target.value)
        this.props.onDateSliderChange(e.target.value);
    }

    // handleReprChange = (i) => {
    //     this.props.onReprSliderChange(i);
    // }

    render() {
        const { stat, statThreshold, seriesMin, seriesMax } = this.props;
        const roundedStat = Math.ceil(statThreshold / 100) * 100;
        const date = readableDate(this.props.dateThreshold);
        return (
            <div className="slider-menu">
                {/* Stat Threshold */}
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
                <p></p>

                {/* Date Threshold */}
                <div className="slidecontainer">
                    <label
                        className="filter-label"
                        htmlFor="dateThreshold">
                        Date Threshold: {date}
                    </label>
                    <input
                        id="dateThreshold"
                        className="filter-label"
                        type="date"
                        value={this.props.dateThreshold}
                        min={this.props.firstDate}
                        max={this.props.lastDate}
                        onChange={this.handleDateChange}>
                    </input>
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