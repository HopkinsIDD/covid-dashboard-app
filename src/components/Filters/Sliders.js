import React, { Component } from 'react';
import { addCommas, readableDate } from '../../utils/utils.js';
import { timeFormat } from 'd3-time-format';

const getDate = timeFormat('%b %d, %Y');
const getMonth = timeFormat('%b');

class Sliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateIdx: "150",
        }
    }

    componentDidMount() {

        const dateIdx = this.props.dates.indexOf(this.props.dateThreshold).toString();
        this.setState({
            dateIdx,
        })
    }
            
    componentDidUpdate(prevProps) {

        if (prevProps.dateThreshold !== this.props.dateThreshold ||
            prevProps.dateRange !== this.props.dateRange) {
            const dateIdx = this.props.dates.indexOf(this.props.dateThreshold).toString();
            this.setState({
                dateIdx,
            })
        }
    }

    handleStatChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateChange = (e) => {
        const selectedDate = this.props.dates[e];
        this.props.onDateSliderChange(selectedDate);
    }

    // handleReprChange = (i) => {
    //     this.props.onReprSliderChange(i);
    // }

    render() {
        const { stat, statThreshold, seriesMin, seriesMax, dates, dateRange, dateThreshold, dateThresholdIdx } = this.props;
        const roundedStat = Math.ceil(statThreshold / 100) * 100;
        
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
                <p className="filter-label">
                    {/* Date Threshold: {date} */}
                    Date Threshold: {getDate(dateThreshold)}
                </p>
                <div className="slidecontainer">
                    <input
                        id="statThreshold"
                        className="slider"
                        type="range"
                        min="0"
                        max={dates.length.toString()}
                        value={dateThresholdIdx}
                        ref={ref => this.dateInput = ref}
                        onChange={
                            () => {this.handleDateChange(this.dateInput.value)}
                        }>
                    </input>
                    <div className="row slider-label">
                        <p className="col-6 filter-label">
                            {/* {firstDateStr} */}
                            {getMonth(dateRange[0])}
                        </p>
                        <p className="col-6 filter-label slider-max">
                            {/* {lastDateStr} */}
                            {getMonth(dateRange[1])}
                        </p>
                    </div>
                </div>
                
                {/* <div className="slidecontainer">
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
                </div> */}

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