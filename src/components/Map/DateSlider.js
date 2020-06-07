import React, { Component } from 'react';
import { getReadableDate } from '../../utils/utils';
import { timeDay }  from 'd3-time';

class DateSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      marks: {},
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
  
  render() {
    const { dates, currentDateIndex } = this.props;
    return (
        <div>
          <div className="param-header">DATE SELECTOR</div>
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
