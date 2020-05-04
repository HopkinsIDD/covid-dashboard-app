import React, { Component } from 'react'
import { axisLeft, axisBottom } from 'd3-axis'
import { timeFormat } from 'd3-time-format'
import { select } from 'd3-selection'
import { addCommas } from '../../utils/utils.js'

class Axis extends Component {
  constructor(props) {
    super(props);
    this.axisRef = React.createRef();
  }

  componentDidMount() {
    this.drawAxis();
  }

  componentDidUpdate() {
    this.updateAxis();
  }

  drawAxis = () => {
    if (this.props.orientation === 'left') {
      this.axis = axisLeft().scale(this.props.scale)
        .tickFormat(d => addCommas(d));

      if (this.axisRef.current) {
        select(this.axisRef.current).call(this.axis)
      }
    } else {
      this.axis = axisBottom().scale(this.props.scale)
        .tickFormat(timeFormat('%b-%d'))
        .ticks(this.props.width / 60)
        .tickSizeOuter(0);

      if (this.axisRef.current) {
          select(this.axisRef.current).call(this.axis).call(g => g.select(".domain").remove());
      }
    }
  }

  updateAxis = () => {
    if (this.axisRef.current) {
      const axisNode = select(this.axisRef.current)
      if (this.props.orientation === 'left') {
        axisNode
          .transition()
          .duration(1000)
          .call(this.axis)
          .call(g => g.select(".domain").remove());
      } else {
        axisNode
          .transition()
          .duration(1000)
          .call(this.axis);
      }
    }
  }

  render() {
    return <g ref={this.axisRef} transform={`translate(${this.props.x}, ${this.props.y})`} />
  }
}

export default Axis;