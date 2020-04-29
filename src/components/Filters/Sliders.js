import React, { Component } from 'react';
import { addCommas, readableDate } from '../../utils/utils.js';

class Sliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            dateIdx: "150",
            firstDateStr: '',
            lastDateStr: '',
        }
    }

    componentDidMount() {
        const date = readableDate(this.props.dateThreshold);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        const firstDateStr = months[this.props.firstDate.getMonth()];
        const lastDateStr = months[this.props.lastDate.getMonth()];

        this.setState({
            date,
            firstDateStr,
            lastDateStr
        })
    }
            
    componentDidUpdate(prevProp) {
        const { dates } = this.props;
        if (prevProp.dateThreshold !== this.props.dateThreshold) {
            const dateIdx = dates.indexOf(this.props.dateThreshold).toString();
            this.setState({
                dateIdx,
            })
        }
    }

    handleStatChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateChange = (e) => {
        const dateString = this.props.dates[e];
        this.props.onDateSliderChange(dateString);
    }

    // handleReprChange = (i) => {
    //     this.props.onReprSliderChange(i);
    // }

    render() {
        const { stat, statThreshold, seriesMin, seriesMax, dates } = this.props;
        const roundedStat = Math.ceil(statThreshold / 100) * 100;
        const { date, firstDateStr, lastDateStr } = this.state;
        
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
                    Date Threshold: {date}
                </p>
                <div className="slidecontainer">
                    <input
                        id="statThreshold"
                        className="slider"
                        type="range"
                        min="0"
                        max={dates.length.toString()}
                        value={this.state.dateIdx}
                        ref={ref => this.dateInput = ref}
                        onChange={
                            () => {this.handleDateChange(this.dateInput.value)}
                        }>
                    </input>
                    <div className="row slider-label">
                        <p className="col-6 filter-label">
                            {firstDateStr}
                        </p>
                        <p className="col-6 filter-label slider-max">
                            {lastDateStr}
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