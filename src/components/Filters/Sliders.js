import React, { Component } from 'react';
import { addCommas } from '../../utils/utils.js';
import { timeFormat } from 'd3-time-format';
import { timeDay }  from 'd3-time';
import { styles } from '../../utils/constants';

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
        // console.log(i)
        this.props.onStatSliderChange(i);
    }

    handleDateChange = (e) => {
        const selectedDate = this.props.dates[e];
        this.props.onDateSliderChange(selectedDate);
    }

    handleStatMouseEvent = (e) => {
        this.props.onSliderMouseEvent(e.type, 'stat', 'graph')
    }

    handleDateMouseEvent = (e) => {
        this.props.onSliderMouseEvent(e.type, 'date', 'graph')
    }

    getStepValue = (seriesMax) => {
        if (seriesMax <= 50) {
            return 1
        } else if (seriesMax <= 1000) {
            return 10
        } else {
            return 100
        }
    }

    render() {
        const { stat, statThreshold, seriesMax, dates, dateRange, dateThreshold, dateThresholdIdx } = this.props;
        const stepVal = this.getStepValue(seriesMax)
        const roundedStat = Math.ceil(statThreshold / stepVal) * stepVal;
        const isDisabled = this.props.showConfBounds ? "disabled" : "";
        return (
            <div className={`slider-menu ${isDisabled}`}>
                {/* Stat Threshold */}
                <div className="param-header">THRESHOLD</div>
                <div className="filter-label">
                    <span className='callout'>
                        {addCommas(roundedStat)}&nbsp;{stat.name}
                    </span>
                </div>
                <input
                    id="statThreshold"
                    type="range"
                    min="0"
                    max={seriesMax.toString()}
                    value={statThreshold.toString()}
                    step={stepVal}
                    style={styles.Selector}
                    ref={ref => this.statInput = ref}
                    disabled={isDisabled}
                    onChange={() => {this.handleStatChange(this.statInput.value)}}
                    onMouseDown={this.handleStatMouseEvent}
                    onMouseUp={this.handleStatMouseEvent}>
                </input> 
                <div className="slider-label-row slider-label" style={styles.Selector}>
                    <p className="filter-label callout">0</p>
                    <p className="filter-label slider-max callout">
                        {addCommas(seriesMax)}
                    </p>
                </div>

                {/* Date Threshold */}
                <div className="param-header" style={{ marginTop: '0.5rem'}}>DATE THRESHOLD</div>
                <div className="filter-label">
                    <span className='callout'>{getDate(dateThreshold)}</span>
                </div>
                <input
                    id="dateThreshold"
                    className="slider"
                    type="range"
                    min="0"
                    max={dates.length.toString()-1}
                    value={dateThresholdIdx}
                    style={styles.Selector}
                    ref={ref => this.dateInput = ref}
                    disabled={isDisabled}
                    onChange={() => {this.handleDateChange(this.dateInput.value)}}
                    onMouseDown={this.handleDateMouseEvent}
                    onMouseUp={this.handleDateMouseEvent}>
                </input>
                <div className="slider-label-row slider-label" style={styles.Selector}>
                    <p className="filter-label callout">
                        {getMonth(dateRange[0])}
                    </p>
                    <p className="filter-label slider-max callout">
                        {getMonth(timeDay.offset(dateRange[1], -1))}
                    </p>
                </div>
            </div>
        )
    }
}

export default Sliders