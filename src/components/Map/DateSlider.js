import React, { Component } from 'react';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { getReadableDate } from '../../utils/utils';
import { timeDay }  from 'd3-time';
import TooltipHandler from '../Filters/TooltipHandler';

class DateSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      marks: {},
      showTooltip: false,
      dateIndex: ''
    }
  }

  componentDidMount() {
    const { dates } = this.props;
    const dateIndex = (dates.length - 1).toString();
    const formattedFirstDate = getReadableDate(dates[0])
    const formattedLastDate = getReadableDate(dates[+dateIndex])
    const marks = {
      0 : {
        label: formattedFirstDate
      }
    }
    marks[dateIndex] = {
      label: formattedLastDate
    }
    this.setState({ marks, dateIndex })
  }

  formatDateTooltip = (value) => {
    return `${value}: ${getReadableDate(this.props.dates[value])}`
  }
  
  handleTooltipClick = () => {
    this.setState({showTooltip: !this.state.showTooltip})
  }

  render() {
    const { dates, currentDateIndex } = this.props;
    return (
        <div>
          <div className="param-header">DATE SELECTOR
              <TooltipHandler
                showTooltip={this.state.showTooltip}
                onClick={this.handleTooltipClick}
                >
                <div className="tooltip">
                  &nbsp;<InfoCircleTwoTone />
                  {this.state.showTooltip &&
                  <span className="tooltip-text">
                  Indicators are calculated after accounting for the appropriate 
                  time delays and probabilities of transitioning into a given state 
                  (e.g., initial infection to hospitalization). 
                  </span> }
                </div>
              </TooltipHandler>
          </div>
          <div className="filter-label">
              <span className='callout'>
                {getReadableDate(dates[currentDateIndex])}
              </span>
          </div>
          <div className="slidecontainer">
            <input
                id="mapDateSlider"
                type="range"
                min={0}
                max={this.state.dateIndex.toString()}
                defaultValue={currentDateIndex.toString()}
                ref={ref => this.dateInput = ref}
                onChange={
                    () => {this.props.onMapSliderChange(this.dateInput.value)}
                }
                onMouseDown={(e) => this.props.onSliderMouseEvent(e.type)}
                onMouseUp={(e) => this.props.onSliderMouseEvent(e.type)}>
            </input> 
            <div className="slider-label-row slider-label">
              <p className="filter-label callout">
                  {/* {firstDateStr} */}
                  {getReadableDate(dates[0])}
              </p>
              <p className="filter-label slider-max callout">
                  {/* {lastDateStr} */}
                  {getReadableDate(timeDay.offset(dates[dates.length - 1], -1))}
              </p>
          </div>
        </div>
      </div>
    )
  }
}

export default DateSlider;
