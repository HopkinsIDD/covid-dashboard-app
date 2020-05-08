import React, { Component } from 'react';
import { addCommas } from '../../utils/utils.js';
import { timeFormat } from 'd3-time-format';
import { timeDay }  from 'd3-time';

const getDate = timeFormat('%b %d, %Y');
const getMonth = timeFormat('%b %d');

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
                <div className="filter-label">
                    {stat.name} Threshold: <span className='callout'>{addCommas(roundedStat)}</span>
                    <div className="tooltip">&nbsp;&#9432;
                        <span className="tooltip-text">Slide the {stat.name} threshold to visualize the percent chance daily {stat.name} exceed the selected value.</span>
                    </div>
                </div>
                <div className="slidecontainer">
                    <input
                        id="statThreshold"
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
                        <p className="col-6 filter-label callout">
                            {addCommas(seriesMin)}
                        </p>
                        <p className="col-6 filter-label slider-max callout">
                            {addCommas(seriesMax)}
                        </p>
                    </div>
                </div>
                <p></p>

                {/* Date Threshold */}
                <div className="filter-label">
                    Date Threshold: <span className='callout'>{getDate(dateThreshold)}</span>
                    <div className="tooltip">&nbsp;&#9432;
                        <span className="tooltip-text">Slide the date threshold to visualize the percent chance daily {stat.name}s exceed the selected value by a given date.</span>
                    </div>
                </div>
                <div className="slidecontainer">
                    <input
                        id="dateThreshold"
                        className="slider"
                        type="range"
                        min="0"
                        max={dates.length.toString()-1}
                        value={dateThresholdIdx}
                        ref={ref => this.dateInput = ref}
                        onChange={
                            () => {this.handleDateChange(this.dateInput.value)}
                        }>
                    </input>
                    <div className="row slider-label">
                        <p className="col-6 filter-label callout">
                            {/* {firstDateStr} */}
                            {getMonth(dateRange[0])}
                        </p>
                        <p className="col-6 filter-label slider-max callout">
                            {/* {lastDateStr} */}
                            {getMonth(timeDay.offset(dateRange[1], -1))}
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