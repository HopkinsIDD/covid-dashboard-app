import React, { Component } from 'react';
import { bin, max } from 'd3-array';
import { scaleLinear }  from 'd3-scale';

class Histogram extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const sorted_sims = this.props.allSims.slice().sort((a,b) => a.r0 - b.r0)
    console.log(sorted_sims)
    console.log(this.props.r0selected)

    const xScale = scaleLinear().domain([2, 3]).range([0, 300])
    const yScale = scaleLinear().range([this.props.height, 0])

    const binGenerator = bin()
        .value(d => d.r0)
        .domain(xScale.domain())
        .thresholds(10)

    const bins = binGenerator(sorted_sims)
    console.log(bins)

    yScale.domain([0, max(bins, d => d.length)])

    // svg.selectAll('rect')
    // .data(bins)
    // .enter()
    // .append('rect')
    // .attr('x', 1)
    // .attr('transform', d => "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")")
    // .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
    // .attr('height', d => height - yScale(d.length))
    // .attr('fill', '#69b3a2')
  }

  componentDidUpdate(prevProps) {

  }

  render() {
      return (
        <svg width={this.props.width} height={this.props.height}>
          
        </svg>
      )
  }
}

export default Histogram


