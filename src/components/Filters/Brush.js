import React, { Component } from 'react'
import { axisBottom } from 'd3-axis'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { select } from 'd3-selection'
import { line } from 'd3-shape'
import { timeFormat } from 'd3-time-format'
import { timeDay, timeYear } from 'd3-time'
import { brushX } from 'd3-brush'
import { event } from 'd3-selection'
import { max, extent } from 'd3-array'
import { easeCubicOut } from 'd3-ease'
import { margin } from '../../utils/constants'
import { green, red } from '../../utils/colors';

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
        .on('start', this.props.onBrushStart())
        .on('end', this.brushEnded)
        .on('brush', this.brushed)
  }

  componentDidMount() {
    // console.log('componentDidMount')
    this.setupBrush(this.state.lineGenerator, this.state.series, this.state.dates, this.state.width, this.state.height);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('different series is ', this.props.series !== prevProps.series)
    // console.log('different r0 is ', this.props.r0 !== prevProps.r0)
    // console.log('different dimensions is', this.props.width !== prevProps.width )
    // console.log('different dateThreshold is', this.props.dateThreshold !== prevProps.dateThreshold)
    // console.log('different statThreshold is', this.props.statThreshold !== prevProps.statThreshold)
    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      // console.log('componentDidUpdate width height change');
      // console.log('different dimensions is', this.props.width !== prevProps.width )
      const { series, dates, width, height } = this.props;
      const { lineGenerator } = prevState;
      this.updateSimPaths(lineGenerator, series, dates, width, height, false);
      return
    }

    // if (this.props.r0 !== prevProps.r0) {
    //   console.log('different r0 is ', this.props.r0 !== prevProps.r0)
    //   console.log('different series is ', this.props.series !== prevProps.series)
    //   const { series, dates, width, height } = this.props;
    //   const { lineGenerator } = prevState;
    //   this.updateSimPaths(lineGenerator, series, dates, width, height, true);
    //   return
    // }

    if (this.props.series !== prevProps.series) {
      // console.log('different series is ', this.props.series !== prevProps.series)
      // console.log('different animateTransition is ', this.props.animateTransition !== prevProps.animateTransition)
      const { series, dates, width, height, animateTransition } = this.props;
      const { lineGenerator } = prevState;
      this.updateSimPaths(lineGenerator, series, dates, width, height, animateTransition);
      return
    }
  }

  updateSimPaths = (lineGenerator, series, dates, width, height, animateTransition) => {
    // console.log('updateSimPaths animateTransition is', animateTransition)
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
      if (animateTransition) {
        simPathsNode.selectAll('.simPath')
            .data(series)
            .transition()
            .duration(1000)
            .ease(easeCubicOut)
            .attr("d", d => lineGenerator(d.vals))
            .attr("stroke", (d,i) => series[i].over ? red : green )
            .on("end", () => {
                // set new vals to state
                // console.log('finished animateTransition update')
                this.setState({ 
                    series: series,
                    dates: dates,
                    scales: updatedScales,
                    lineGenerator: lineGenerator,
                    simPaths: simPaths,
                })
            })
      } else {
        // console.log('No animateTransition')
        simPathsNode.selectAll('.simPath')
            .data(series)
            .attr("d", d => lineGenerator(d.vals))
            .attr("stroke", (d,i) => series[i].over ? red : green )
            .on("end", () => {
                // set new vals to state
                // console.log('finished no animateTransition update')
                this.setState({ 
                    series: series,
                    dates: dates,
                    scales: updatedScales,
                    lineGenerator: lineGenerator,
                    simPaths: simPaths,
                })
            })
            this.props.toggleAnimateTransition()
        }

    }
  
    // this.xAxis.scale(this.state.xScale);
    if (this.xAxisRef.current) {
      const xAxisNode = select(this.xAxisRef.current)
      xAxisNode.call(this.xAxis);
    }
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
      .tickFormat((date,i) => {
        // console.log(timeYear(date))
        // console.log(i, date)
        // console.log(timeDay.offset(date, -31))
        // console.log(" ")
        if (timeYear(date) < timeDay.offset(date, -31)) {
          return timeFormat('%b')(date);
        } else {
          return timeFormat('%Y')(date);
        }
      })
      .ticks(this.state.width / 80).tickSizeOuter(0);
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