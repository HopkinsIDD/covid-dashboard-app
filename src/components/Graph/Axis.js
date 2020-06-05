import React, { Component } from 'react'
import { axisLeft, axisBottom, axisRight } from 'd3-axis'
import { timeFormat } from 'd3-time-format'
import { select } from 'd3-selection'
import { addCommas, formatTitle } from '../../utils/utils.js'

class Axis extends Component {
  constructor(props) {
    super(props);
    this.axisRef = React.createRef();
  }

  componentDidMount() {
    this.drawAxis();
  }

  componentDidUpdate(prevProps) {
    this.updateAxis();
  }

  drawAxis = () => {
    if (this.props.orientation === 'left') {
      this.axis = axisLeft().scale(this.props.scale)
        .ticks(this.props.tickNum ? this.props.tickNum : 10)
        .tickFormat(d => addCommas(d));

      if (this.axisRef.current) {
        select(this.axisRef.current).call(this.axis)
      }
    } else if (this.props.orientation === 'right') {
      this.axis = axisRight().scale(this.props.scale)
        .tickFormat(d => addCommas(d));

      if (this.axisRef.current) {
        select(this.axisRef.current).call(this.axis)
      }
    } else {
      if (this.props.view === 'graph') {
        this.axis = axisBottom().scale(this.props.scale)
          .tickFormat(timeFormat('%b-%d'))
          .ticks(this.props.width / 60)
          .tickSizeOuter(0);
      } else if (this.props.view === 'chart') {
        this.axis = axisBottom().scale(this.props.scale)
          .tickFormat(d => formatTitle(d))
          .ticks(this.props.width / 60)
          .tickSizeOuter(0);
      } else {
        this.axis = axisBottom().scale(this.props.scale)
          .ticks(this.props.width / 60)
          .tickSizeOuter(0);
      }
      

      if (this.axisRef.current) {
          if (this.props.view === 'chart') {
            select(this.axisRef.current)
              .call(this.axis)
              .call(g => g.select(".domain").remove())
            .selectAll('.tick text')
            .call(this.wrap, this.props.scale.bandwidth() - 5)
          } else {
            select(this.axisRef.current)
              .call(this.axis)
              .call(g => g.select(".domain").remove());
          }
      }
    }
  }

  updateAxis = () => {
    // console.log('componentDidUpdate', this.props.width, this.props.height)
    if (this.axisRef.current) {
      // console.log(this.props.scale.domain())
      const axisNode = select(this.axisRef.current)
      this.axis.scale(this.props.scale)
        // console.log(axisNode)
        if (this.props.orientation === 'left') {
          // update y axis
          axisNode
            .transition()
            .duration(1000)
            .call(this.axis)
            .call(g => g.select(".domain").remove());
        } else {
          // update x axis
            axisNode
              .transition()
              .duration(1000)
              .call(this.axis)
        }

       
        if (this.props.view !== 'graph') {
          select(this.axisRef.current)
          .call(this.axis).call(g => g.select(".domain").remove());
        }

        if (this.props.view === 'chart') {
          console.log('in chart update')
          select(this.axisRef.current)
              .call(this.axis)
              .call(g => g.select(".domain").remove())
            .selectAll('.tick text')
            .call(this.wrap, this.props.scale.bandwidth() - 5)
        }
      
      }
    }

    wrap = (text, width) => {
      console.log('calling text wrap function')
      text.each(function() {
        const text = select(this)
        const words = text.text().split(/\s+/).reverse()
        let word
        let line = []
        let lineNumber = 0
        const lineHeight = 1.1 // ems
        const y = text.attr("y")
        const dy = parseFloat(text.attr("dy"))
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
        // console.log(dy, lineNumber, lineHeight)
        // console.log(words)
        while (word = words.pop()) {
          // console.log(word)
          line.push(word)
          tspan.text(line.join(" "))
          if (tspan.node().getComputedTextLength() > width) {
            console.log(dy, lineNumber, lineHeight)
            console.log(tspan.node().getComputedTextLength(), tspan.text())
            console.log(line)
            line.pop()
            tspan.text(line.join(" "))
            line = [word]
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
            console.log(tspan)
          }
        }
      })
      // console.log(text)
    }

  render() {
    return <g ref={this.axisRef} transform={`translate(${this.props.x}, ${this.props.y})`} />
  }
}

export default Axis;