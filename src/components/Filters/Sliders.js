import React, { Component } from 'react';
import { addCommas } from '../../utils/utils.js';
import { timeFormat } from 'd3-time-format';
import { timeDay }  from 'd3-time';
// import { Slider } from 'antd'

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
        console.log(i)
        this.props.onStatSliderChange(i);
    }

    handleDateChange = (e) => {
        const selectedDate = this.props.dates[e];
        this.props.onDateSliderChange(selectedDate);
    }

    render() {
        const { stat, statThreshold, seriesMin, seriesMax, dates, dateRange, dateThreshold, dateThresholdIdx } = this.props;
        const roundedStat = Math.ceil(statThreshold / 100) * 100;
        
        return (
            <div className="slider-menu">
                {/* Stat Threshold */}
                <div className="param-header">INDICATOR THRESHOLD</div>
                <div className="filter-label">
                    {stat.name}: <span className='callout'>{addCommas(roundedStat)}</span>
                </div>
                <div className="slidecontainer">
                    <input
                        id="statThreshold"
                        type="range"
                        min={seriesMin.toString()}
                        max={seriesMax.toString()}
                        value={statThreshold.toString()}
                        step={100}
                        ref={ref => this.statInput = ref}
                        onChange={
                            () => {this.handleStatChange(this.statInput.value)}
                        }>
                    </input> 
                    <div className="slider-label-row slider-label">
                        <p className="filter-label callout">
                            {addCommas(seriesMin)}
                        </p>
                        <p className="filter-label slider-max callout">
                            {addCommas(seriesMax)}
                        </p>
                    </div>
                </div>
                <p></p>

                {/* Date Threshold */}
                <div className="param-header">DATE THRESHOLD</div>
                <div className="filter-label">
                    Date: <span className='callout'>{getDate(dateThreshold)}</span>
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
                    <div className="slider-label-row slider-label">
                        <p className="filter-label callout">
                            
                            {getMonth(dateRange[0])}
                        </p>
                        <p className="filter-label slider-max callout">
                           
                            {getMonth(timeDay.offset(dateRange[1], -1))}
                        </p>
                        <span className="tooltip-text">
                        Slide the date threshold to visualize the percent chance daily 
                        {stat.name}s exceed the selected value by a given date.</span>
                    </div>
                </div> 

                <div className="filter-description">
                    Slide over indicator value and day to see how likely daily&nbsp;
                    {stat.name} will exceed a certain number by a given day.
                </div>
            </div>
        )
    }
}

export default Sliders