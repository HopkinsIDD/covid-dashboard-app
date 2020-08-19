import React, { Component } from 'react';
import { bin, min, max, range } from 'd3-array';
import { scaleLinear }  from 'd3-scale';
import { colors } from '../../utils/colors.js';

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    }
  }

  componentDidMount() {
    const width = document.querySelector('.r0-slider').clientWidth
    this.setState({ width }, () => this.makeBins())
    window.addEventListener('resize', this.updateHistogramWidth);
  }

  updateHistogramWidth = () => {
    const width = document.querySelector('.r0-slider').clientWidth
    this.setState({ width })
  }

  makeBins = () => {
    const { sortedSims, selectedSims, r0min, r0max, step } = this.props;
    // const sorted_sims = sortedSims//this.props.allSims.slice().sort((a,b) => a.r0 - b.r0)
    const sorted_selected_sims = selectedSims.slice().sort((a,b) => a.r0 - b.r0)
    // console.log(sorted_sims)
    const r0only = sortedSims.map(d => d.r0)
    console.log(r0only)
    // const r0min = min(sorted_sims, d => d.r0)
    // const r0max = max(sorted_sims, d => d.r0)
    // console.log(r0min, r0max)
    const xScale = scaleLinear().domain([r0min, r0max]).range([0, this.state.width]).nice()
    const yScale = scaleLinear().range([this.props.height, 1])
    // const skipFactor = (r0max - r0min) / 10
    // console.log(skipFactor)
    const thresholds = range(r0min, r0max, step)
    console.log(thresholds)

    const binGenerator = bin()
        .value(d => d.r0)
        .domain(xScale.domain())
        .thresholds(thresholds)

    const bins = binGenerator(sortedSims)
    console.log(bins)
    const selectedBins = binGenerator(sorted_selected_sims)
    console.log(selectedBins)

    yScale.domain([0, max(bins, d => d.length)])
    this.setState({ xScale, yScale, binGenerator, bins, selectedBins })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.width !== prevState.width) {
      this.makeBins()
    }
    if (this.props.selectedSims !== prevProps.selectedSims || this.props.selected !== prevProps.selected) {
      const sorted_selected_sims = this.props.selectedSims.slice().sort((a,b) => a.r0 - b.r0)
      const selectedBins = this.state.binGenerator(sorted_selected_sims)
      this.setState({ selectedBins })
      this.makeBins()
    }
  }

  render() {
    const { xScale, yScale, bins, selectedBins } = this.state;
    // const { width, height } = this.props;
      return (
        <div>
        {this.props.width && this.state.xScale &&
          <svg width={this.props.width} height={this.props.height}>
            <g>
              {bins.map( (bin,i) => {
                console.log(bin)
              return (
                <rect 
                  key={`hist-${i}`}
                  x={xScale(bin.x0)}
                  y={yScale(bin.length)}
                  width={xScale(bin.x1) - xScale(bin.x0)}
                  height={this.props.height - yScale(bin.length)}
                  fill="#ffffff"
                  stroke={colors.chartBkgd}
                >
                </rect>
              )
            })}
            </g>
            <g>
            {selectedBins.map( (bin,i) => {
              return (
                <rect 
                  key={`hist-${i}`}
                  x={xScale(bin.x0)}
                  y={yScale(bin.length)}
                  width={xScale(bin.x1) - xScale(bin.x0)}
                  height={this.props.height - yScale(bin.length)}
                  fill={colors.sliderBlue}
                  stroke={colors.chartBkgd}
                >
                </rect>
              )
            })}
            </g>
        </svg>
        }
        </div>
        
      )
  }
}

export default Histogram


