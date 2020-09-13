import React, { Component } from 'react';
import { InfoCircleTwoTone } from '@ant-design/icons';
import TooltipHandler from '../Filters/TooltipHandler';
import { addCommas } from '../../utils/utils.js';
import { timeFormat } from 'd3-time-format';
import { timeDay }  from 'd3-time';
import { styles } from '../../utils/constants';
import { getStepValue } from '../../utils/utils';

const getDate = timeFormat('%b %d, %Y');
const getMonth = timeFormat('%b %d');

class Sliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltipThreshold: false,
            showTooltipDateThreshold: false,
            dateIdx: "150",
            val: addCommas(this.props.indicatorThreshold.toString())
        }
    }

    componentDidMount() {
        
        const dateIdx = this.props.selectedDates.indexOf(this.props.dateThreshold).toString();
        const stepVal = getStepValue(this.props.seriesMax)
        const roundedStat = Math.ceil(this.props.indicatorThreshold / stepVal) * stepVal;
        this.setState({
            dateIdx,
            stepVal, 
            val: addCommas(roundedStat)
        })
    }
            
    componentDidUpdate(prevProps) {

        if (prevProps.dateThreshold !== this.props.dateThreshold ||
            prevProps.dateRange !== this.props.dateRange) {
            const dateIdx = this.props.selectedDates.indexOf(this.props.dateThreshold).toString();
            this.setState({
                dateIdx,
            })
        }
        if (this.props.indicatorThreshold !== prevProps.indicatorThreshold) {
            const stepVal = getStepValue(this.props.seriesMax)
            const roundedStat = Math.ceil(this.props.indicatorThreshold / stepVal) * stepVal;
            this.setState({ stepVal, val: addCommas(roundedStat) })
        }
    }

    handleStatChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateChange = (e) => {
        const selectedDate = this.props.selectedDates[e];
        this.props.onDateSliderChange(selectedDate);
    }

    handleStatMouseEvent = (e) => {
        this.props.onSliderMouseEvent(e.type, 'indicator', 'graph')
    }

    handleDateMouseEvent = (e) => {
        this.props.onSliderMouseEvent(e.type, 'date', 'graph')
    }

    handleTooltipClickThresh = () => {
        this.setState({showTooltipThreshold: !this.state.showTooltipThreshold})
    }

    handleTooltipClickDate = () => {
        this.setState({showTooltipDateThreshold: !this.state.showTooltipDateThreshold})
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
        const { indicator, indicatorThreshold, seriesMax, selectedDates, dateRange, dateThreshold, dateThresholdIdx } = this.props;
        const isDisabled = this.props.showConfBounds ? "disabled" : "";
        return (
            <div className={`slider-menu`}>
                {/* Indicator Threshold */}
                <div className="param-header">THRESHOLD
                    <TooltipHandler
                        showTooltip={this.state.showTooltipThreshold}
                        onClick={this.handleTooltipClickThresh}
                        >
                        <div className="tooltip">
                            &nbsp;<InfoCircleTwoTone />
                            {this.state.showTooltipThreshold &&
                            <span className="tooltip-text">
                            This is the Threshold value used for the display in “Threshold Exceedance” mode. 
                            You will not be able to modify this slider when in “Confidence Bounds” mode.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <div className="filter-label">
                    <span className='callout'>
                        {this.state.val}&nbsp;{indicator.name}
                    </span>
                </div>
                <input
                    id="indicatorThreshold"
                    type="range"
                    min="0"
                    max={seriesMax.toString()}
                    value={indicatorThreshold.toString()}
                    step={this.state.stepVal}
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
                <div className="param-header" style={{ marginTop: '0.5rem'}}>DATE THRESHOLD
                    <TooltipHandler
                        showTooltip={this.state.showTooltipDateThreshold}
                        onClick={this.handleTooltipClickDate}
                        >
                        <div className="tooltip">
                            &nbsp;<InfoCircleTwoTone />
                            {this.state.showTooltipDateThreshold &&
                            <span className="tooltip-text">
                            This is the Date Threshold used for the display in “Threshold Exceedance” mod
                            You will not be able to modify this slider when in “Confidence Bounds” mode.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <div className="filter-label">
                    <span className='callout'>{getDate(dateThreshold)}</span>
                </div>
                <input
                    id="dateThreshold"
                    className="slider"
                    type="range"
                    min="0"
                    max={selectedDates.length.toString()-1}
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