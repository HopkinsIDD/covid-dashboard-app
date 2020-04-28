import React, { Component } from 'react'
import { axisBottom } from 'd3-axis'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { select } from 'd3-selection'
import { line } from 'd3-shape'
import { timeFormat } from 'd3-time-format'
import { event } from 'd3-selection'
import { max, extent } from 'd3-array'
import { COLORS } from '../../store/constants.js'

const margin = { top: 20, right: 40, bottom: 30, left: 80 };

class Brush extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: this.props.width,
      height: this.props.height,
      series: this.props.series,
      dates: this.props.dates,
      xScale: scaleUtc().range([margin.left, this.props.width - margin.right]),
      yScale: scaleLinear().range([this.props.height - margin.bottom, margin.top]),
      lineGenerator: line().defined(d => !isNaN(d)),
      simPaths: [],
    }
    this.xAxisRef = React.createRef();
    this.xAxis = axisBottom().scale(this.state.xScale)
        .tickFormat(timeFormat('%b'))
        .ticks(this.state.width / 80).tickSizeOuter(0);
    
    this.simPathsRef = React.createRef();
  }

  componentDidMount() {
    this.drawSimPaths(this.state.series, this.state.dates);

    if (this.xAxisRef.current) {
      select(this.xAxisRef.current).call(this.xAxis)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.series !== prevProps.series || this.props.dates !== prevProps.dates) {
      const { series, dates } = this.props;
      const { xScale, yScale, lineGenerator, width, height } = prevState;

      if (this.simPathsRef.current) {
                
        // update scale and data
        const updatedScales = this.calculateSimPaths(series, dates)
      
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
            .transition()
            .duration(1000)
            .attr("d", d => updatedScales.lineGenerator(d.vals))
            .on("end", () => {
                // set new vals to state
                this.setState({ 
                    series: series,
                    dates: dates,
                    xScale: updatedScales.xScale,
                    yScale: updatedScales.yScale,
                    lineGenerator: updatedScales.lineGenerator,
                    simPaths: simPaths,
                })
            })
      
      }
    
      // this.xAxis.scale(this.state.xScale);
      if (this.xAxisRef.current) {
        const xAxisNode = select(this.xAxisRef.current)
        xAxisNode.call(this.xAxis);
      }

    }
  }

  drawSimPaths = (series, dates) => {
    const { xScale, yScale, lineGenerator, width, height } = this.state;
    const updatedScales = this.calculateSimPaths(series, dates);
    // generate simPaths from lineGenerator
    const simPaths = series.map( (d,i) => {
        // console.log(i, typeof(d.vals))
        return lineGenerator(d.vals)
    })
    // set new vals to state
    this.setState({ 
        series: series,
        dates: dates,
        xScale: updatedScales.xScale,
        yScale: updatedScales.yScale,
        lineGenerator: updatedScales.lineGenerator,
        simPaths: simPaths,
    })
  }

  calculateSimPaths = (series, dates) => {
    console.log(series)
    // draw the sims first here (without transitioning)
    const { xScale, yScale, lineGenerator, width, height } = this.state;
    // calculate scale domains
    const timeDomain = extent(dates);
    // const maxVal = max(series, sims => max(sims.map( d => max(d.vals))))
    const maxVal = max(series, sims => max(sims.vals))
    // set scale ranges to width and height of container
    xScale.range([margin.left, width - margin.right])
    yScale.range([height - margin.bottom, margin.top])
    // set scale domains and lineGenerator domains
    xScale.domain(timeDomain);
    yScale.domain([0, maxVal]).nice();
    lineGenerator.x((d,i) => xScale(dates[i]))
    lineGenerator.y(d => yScale(d))

    return { xScale, yScale, lineGenerator }
  }

  render() {
    return (
      <div className='brush-wrapper'>
        <svg width={this.state.width} height={this.state.height}>
          <g>
            <g ref={this.xAxisRef}  transform={`translate(0, ${this.state.height - margin.bottom})`} />
            <g ref={this.simPathsRef}>
            {
              // visible simPaths
              this.state.simPaths.map( (simPath, i) => {
                  return <path
                      d={simPath}
                      key={`simPath-${i}`}
                      id={`simPath-${i}`}
                      className={`simPath`}
                      fill='none' 
                      stroke = { this.state.series[i].over ? COLORS['red'] : COLORS['green'] }
                      strokeWidth={'1'}
                      strokeOpacity={ 0.4 }
                  />
              })}
            </g>
          </g>
        </svg>
      </div>
    )
  }
}

export default Brush;