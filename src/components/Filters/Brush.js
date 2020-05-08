import React, { Component } from 'react'
import { axisBottom } from 'd3-axis'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { select } from 'd3-selection'
import { line } from 'd3-shape'
import { timeFormat } from 'd3-time-format'
import { brushX } from 'd3-brush'
import { event } from 'd3-selection'
import { max, extent } from 'd3-array'
import { margin, red, green } from '../../utils/constants'

class Brush extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: this.props.width,
      height: this.props.height,
      series: this.props.series,
      dates: this.props.dates,
      scales: {},
      // xScale: scaleUtc().range([margin.left, this.props.width - margin.right]),
      // yScale: scaleLinear().range([this.props.height - margin.bottom, margin.top]),
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
          [this.state.width - margin.right, this.state.height - margin.bottom]
        ])
        .on('start', this.brushStart)
        .on('end', this.brushEnded)
        .on('brush', this.brushed)
  }

  componentDidMount() {
    // console.log('componentDidMount')
    this.setupBrush(this.state.lineGenerator, this.state.series, this.state.dates, this.state.width, this.state.height);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('different series is ', this.props.series !== prevProps.series)
    // console.log('different dateThreshold is', this.props.dateThreshold !== prevProps.dateThreshold)
    // console.log('different statThreshold is', this.props.statThreshold !== prevProps.statThreshold)
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      // console.log('componentDidUpdate width height change');
      const { series, dates, width, height } = this.props;
      const { lineGenerator } = prevState;
      this.updateSimPaths(lineGenerator, series, dates, width, height);
    }

    if (this.props.series !== prevProps.series) {

      const { series, dates, width, height } = this.props;
      const { lineGenerator } = prevState;
      this.updateSimPaths(lineGenerator, series, dates, width, height);
    }
  }

  updateSimPaths = (lineGenerator, series, dates, width, height) => {
    // const { lineGenerator } = this.state;
    if (this.simPathsRef.current) {
      // update scale and data
      const updatedScales = this.getScales(series, dates, width, height)

      lineGenerator.x((d,i) => updatedScales.xScale(dates[i]))
      lineGenerator.y(d => {
          // console.log(d)
          // console.log(yScale(d))
          return updatedScales.yScale(d)
      })
    
      // generate simPaths from lineGenerator
      const simPaths = series.map( (d,i) => {
          // console.log(i, typeof(d.vals))
          return lineGenerator(d.vals)
      })
    
      // get svg node
      const simPathsNode = select(this.simPathsRef.current)
      // console.log(simPathsNode.selectAll('.simPath'))
      // update the paths with new data
      simPathsNode.selectAll('.simPath')
          .data(series)
          .attr("stroke", (d,i) => series[i].over ? red : green )
          .transition()
          .duration(1000)
          .attr("d", d => lineGenerator(d.vals))
          .on("end", () => {
              // set new vals to state
              this.setState({ 
                  series: series,
                  dates: dates,
                  scales: updatedScales,
                  lineGenerator: lineGenerator,
                  simPaths: simPaths,
              })
          })
    
    }
  
    // this.xAxis.scale(this.state.xScale);
    if (this.xAxisRef.current) {
      const xAxisNode = select(this.xAxisRef.current)
      xAxisNode.call(this.xAxis);
    }
    // this.xAxis.scale(this.state.xScale);
    // if (this.xAxisYearRef.current) {
    //   const xAxisNode = select(this.xAxisYearRef.current)
    //   xAxisNode.call(this.xAxisYear);
    // }
  }

  setupBrush = (lineGenerator, series, dates, width, height) => {
    const updatedScales = this.getScales(series, dates, width, height);
    lineGenerator.x((d,i) => updatedScales.xScale(dates[i]))
    lineGenerator.y(d => {
        // console.log(d)
        // console.log(yScale(d))
        return updatedScales.yScale(d)
    })
    // generate simPaths from lineGenerator
    const simPaths = series.map( (d) => {
        // console.log(i, typeof(d.vals))
        return lineGenerator(d.vals)
    })

    this.xAxis = axisBottom().scale(updatedScales.xScale)
      .tickFormat(timeFormat('%b'))
      .ticks(this.state.width / 80).tickSizeOuter(0);
    if (this.xAxisRef.current) {
      select(this.xAxisRef.current).call(this.xAxis)
    }

    // this.xAxisYear = axisBottom().scale(updatedScales.xScale)
    //   .tickFormat(timeFormat('%Y'))
    //   .ticks(2).tickSizeOuter(0);
    // if (this.xAxisYearRef.current) {
    //   select(this.xAxisYearRef.current).call(this.xAxisYear)
    // }

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

  brushStart = () => {
    // console.log(event)
    this.props.onBrushStart();
  }

  brushed = () => {
    // console.log(event)
    if (event.selection && event.sourceEvent !== null) {
      const [x1, x2] = event.selection;
      const range = [this.state.scales.xScale.invert(x1), this.state.scales.xScale.invert(x2)];
      // console.log(range)
      this.props.onBrushChange(range);
    }
  }

  brushEnded = () => {
    // console.log(event)
    if (!event.selection && this.brushRef.current) {
      select(this.brushRef.current).call(this.brush.move, this.state.defaultRange)
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
          <g>
            <g ref={this.xAxisRef}  transform={`translate(0, ${this.props.height - margin.bottom})`} />
            {/* <g ref={this.xAxisYearRef}  transform={`translate(0, ${this.props.height - margin.bottom})`} /> */}
            <g ref={this.simPathsRef}>
            <rect 
                x={margin.left}
                y={margin.top}
                width={this.props.width - margin.left - margin.right}
                height={this.props.height - margin.bottom - margin.top}
                fill={'#f6f5f5'}
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
                      stroke = { this.state.series[i].over ? red : green }
                      strokeWidth={'1'}
                      strokeOpacity={ 0.4 }
                  />
              })}
            </g>
            <g ref={this.brushRef} />
          </g>
        </svg>
      </div>
    )
  }
}

export default Brush;