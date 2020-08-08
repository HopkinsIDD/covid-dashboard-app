import React, { Component } from 'react'
import { axisBottom } from 'd3-axis'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { select, event } from 'd3-selection'
import { line } from 'd3-shape'
import { timeFormat } from 'd3-time-format'
import { brushX, brushSelection } from 'd3-brush'
import { max, extent } from 'd3-array'
import { easeCubicOut } from 'd3-ease'
import { margin, monthDateFormat } from '../../utils/constants'
import { colors } from '../../utils/colors';

class Brush extends Component {
  constructor(props) {
    super(props)
    this.state = {
      series: [],
      dates: [],
      scales: {},
      lineGenerator: line().defined(d => !isNaN(d)),
      simPaths: [],
    }
    this.xAxisRef = React.createRef();
    this.xAxisYearRef = React.createRef();
    this.simPathsRef = React.createRef();
    this.brushRef = React.createRef();
    this.brush = brushX()
        .extent([
          [margin.left, margin.top],
          [this.props.width - margin.right, this.props.height - margin.bottom]
        ])
        .on('start', this.props.onBrushStart())
        .on('end', this.brushEnded)
        .on('brush', this.brushed)
  }

  componentDidMount() {
    this.setupBrush(this.props.series, this.props.dates, this.props.width, this.props.height);
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      const { series, dates, width, height } = this.props;
      const { lineGenerator } = prevState;
      this.updateSimPaths(lineGenerator, series, dates, width, height, false);
      return
    }

    if (this.props.series !== prevProps.series) {
      const { series, dates, width, height, animateTransition } = this.props;
      const { lineGenerator } = prevState;
      this.updateSimPaths(lineGenerator, series, dates, width, height, animateTransition);
      return
    }
  }

  updateSimPaths = (lineGenerator, series, dates, width, height, animateTransition) => {
    const updatedScales = this.getScales(series, dates, width, height)

    if (this.simPathsRef.current) {
      // update scale and data

      lineGenerator.x((d,i) => updatedScales.xScale(dates[i]))
      lineGenerator.y(d => updatedScales.yScale(d))
    
      // generate simPaths from lineGenerator
      const simPaths = series.map( (d,i) => {
          return lineGenerator(d.vals)
      })

      this.setState({ 
          series: series,
          dates: dates,
          lineGenerator: lineGenerator,
          simPaths: simPaths,
      })
    
      // get svg node
      const simPathsNode = select(this.simPathsRef.current)
      // update the paths with new data
      if (animateTransition) {
        simPathsNode.selectAll('.simPath')
            .data(series)
            .transition()
            .duration(100)
            .ease(easeCubicOut)
                .attr('stroke-opacity', 0)
            .transition()
            .duration(700)
            .ease(easeCubicOut)
            .attr("d", d => lineGenerator(d.vals))
            .attr("stroke", (d,i) => series[i].over ? colors.red : colors.green )
            .attr("stroke-opacity", 0.6)
            .on("end", () => {
                // set new vals to state
                this.setState({ 
                    scales: updatedScales
                })
            })
      } else {
        simPathsNode.selectAll('.simPath')
            .data(series)
            .attr("d", d => lineGenerator(d.vals))
            .attr("stroke", (d,i) => series[i].over ? colors.red : colors.green )
        }
    }
  
    if (this.xAxisRef.current) {
      this.xAxis.scale(updatedScales.xScale)
      const xAxisNode = select(this.xAxisRef.current)
      xAxisNode.call(this.xAxis);
    }
    if (this.brushRef.current) {
      this.brush.extent([
            [margin.left, margin.top],
            [this.props.width - margin.right, this.props.height - margin.bottom]
      ])
      const brushRefNode = select(this.brushRef.current)
      brushRefNode.call(this.brush)
        .call(this.brush.move, [ updatedScales.xScale(this.props.dateRange[0]), updatedScales.xScale(this.props.dateRange[1]) ])
    }
    // save new scales to state if transition doesn't animate
    this.setState({ scales: updatedScales })
  }

  setupBrush = (series, dates, width, height) => {
    const { lineGenerator } =  this.state
    const updatedScales = this.getScales(series, dates, width, height);
    lineGenerator.x((d,i) => updatedScales.xScale(dates[i]))
    lineGenerator.y(d => {
        return updatedScales.yScale(d)
    })
    // generate simPaths from lineGenerator
    const simPaths = series.map( (d) => {
        return lineGenerator(d.vals)
    })

    this.xAxis = axisBottom().scale(updatedScales.xScale)
      .tickFormat((date,i) => {
        // if (timeYear(date) < timeDay.offset(date, -1)) {
          return timeFormat(monthDateFormat)(date);
        // } else {
        //   return timeFormat('%Y')(date);
        // }
      })
      .ticks(this.props.width / 80).tickSizeOuter(0);
    if (this.xAxisRef.current) {
      select(this.xAxisRef.current).call(this.xAxis)
    }

    if (this.brushRef.current) {
      const brushRefNode = select(this.brushRef.current)
      brushRefNode.call(this.brush)
        .call(this.brush.move, [ updatedScales.xScale(this.props.dateRange[0]), updatedScales.xScale(this.props.dateRange[1]) ])
    }

    // set new vals to state
    this.setState({ 
        series: series,
        dates: dates,
        scales: updatedScales,
        lineGenerator: lineGenerator,
        simPaths: simPaths,
    })
}

  getScales = (series, dates, width, height) => {
    // calculate scale domains
    const timeDomain = extent(dates);
    const maxVal = max(series, sims => max(sims.vals))
    // set scale ranges to width and height of container
    const xScale = scaleUtc().range([margin.left, width - margin.right])
                             .domain(timeDomain);
    const yScale = scaleLinear().range([height - margin.bottom, margin.top])
                                .domain([0, maxVal]).nice();
    return { xScale, yScale }
}

  brushed = () => {
    const selection = event.selection;
    if (selection === null) {
      return;
    }
    if (event.selection && event.sourceEvent !== null) {
      const [x1, x2] = event.selection;
      const range = [this.state.scales.xScale.invert(x1), this.state.scales.xScale.invert(x2)];
      this.props.onBrushChange(range);
    }
  }

  brushEnded = () => {
    if (!event.selection && this.brushRef.current) {
      const selection = brushSelection(this.brushRef.current) ? null : this.state.scales.xScale.range();
      select(this.brushRef.current).call(this.brush.move, selection)
    }
    this.props.onBrushEnd();
  }

  render() {
    return (
      <div className='brush-wrapper'>
        <svg 
          width={this.props.width} 
          height={this.props.height} 
          transform={`translate(${this.props.x},${this.props.y})`}
        >
          <g ref={this.xAxisRef}  transform={`translate(0, ${this.props.height - margin.bottom})`} />
          {/* <g ref={this.xAxisYearRef}  transform={`translate(0, ${this.props.height - margin.bottom})`} /> */}
          <g ref={this.simPathsRef}>
          <rect 
              x={margin.left}
              y={margin.top}
              width={this.props.width - margin.left - margin.right}
              height={this.props.height - margin.bottom - margin.top}
              fill={'#fbfbfb'}
          />
          {
            // visible simPaths
            this.state.simPaths.map( (simPath, i) => {
                return <path
                    d={simPath}
                    key={`simPath-${i}`}
                    id={`simPath-${i}`}
                    className={`simPath`}
                    fill='none' 
                    stroke = { this.state.series[i].over ? colors.red : colors.green }
                    strokeWidth={'1'}
                    strokeOpacity={ 0.4 }
                />
            })}
          </g>
          <g ref={this.brushRef} />
        </svg>
      </div>
    )
  }
}

export default Brush;