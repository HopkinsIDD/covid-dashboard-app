import React, { Component } from 'react';
import { Slider } from 'antd';
import { getReadableDate } from '../../utils/utils';

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
    console.log(formattedFirstDate, formattedLastDate)
    console.log(endIndex)
    const marks = {
      0 : {
        label: formattedFirstDate
      }
    }
    marks[endIndex] = {
      label: formattedLastDate
    }
    console.log(marks)
    this.setState({ marks })
  }

  formatDateTooltip = (value) => {
    return `${value}: ${getReadableDate(this.props.dates[value])}`
  }
  

  render() {
    // console.log('0', this.props.endIndex)
    return (
      <Slider 
        min={0}
        max={this.props.endIndex}
        defaultValue={this.props.currentDateIndex}
        onChange={this.props.onMapSliderChange}
        // onAfterChange={this.props.onMapSliderChange()}
        marks={this.state.marks}
        tipFormatter={this.formatDateTooltip}
      
      />
    )
  }
}

export default DateSlider;