import React, { Component } from 'react';
import { getReadableDate } from '../../utils/utils';
import { timeDay }  from 'd3-time';

class DateSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endIndex: 0,
      marks: {}
    }
  }

  componentDidMount() {
    const { endIndex } = this.props;
    const formattedFirstDate = getReadableDate(this.props.dates[0])
    const formattedLastDate = getReadableDate(this.props.dates[+endIndex])
    const marks = {
      0 : {
        label: formattedFirstDate
      }
    }
    marks[endIndex] = {
      label: formattedLastDate
    }
    this.setState({ marks })
  }

  formatDateTooltip = (value) => {
    return `${value}: ${getReadableDate(this.props.dates[value])}`
  }
  
  handleDateMouseEvent = (e) => {
    this.props.onSliderMouseEvent(e.type, 'date', 'map')
  }

  render() {
    // console.log('0', this.props.endIndex)
    return (
        <div>
          <div className="param-header">DATE SELECTOR</div>
          <div className="filter-label">
              <span className='callout'>{getReadableDate(this.props.selectedDate)}</span>
          </div>
          <div className="slidecontainer">
            <input
                id="mapDateSlider"
                type="range"
                min={0}
                max={this.props.endIndex.toString()}
                defaultValue={this.props.currentDateIndex.toString()}
                ref={ref => this.dateInput = ref}
                onChange={
                    () => {this.props.onMapSliderChange(this.dateInput.value)}
                }
                onMouseDown={this.handleDateMouseEvent}
                onMouseUp={this.handleDateMouseEvent}>
            </input> 
            <div className="slider-label-row slider-label">
              <p className="filter-label callout">
                  {/* {firstDateStr} */}
                  {getReadableDate(this.props.dates[0])}
              </p>
              <p className="filter-label slider-max callout">
                  {/* {lastDateStr} */}
                  {getReadableDate(timeDay.offset(this.props.dates[this.props.dates.length - 1], -1))}
              </p>
          </div>
        </div>
        <div className="filter-description">
          Slide to select a date for the geographic maps. 
          Use right and left arrow keys to increase or decrease by day.
        </div>
      </div>
    )
  }
}

export default DateSlider;
