import React, { Component } from 'react';
import { bin, max } from 'd3-array';
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
    const sorted_sims = this.props.allSims.slice().sort((a,b) => a.r0 - b.r0)
    const sorted_selected_sims = this.props.selectedSims.slice().sort((a,b) => a.r0 - b.r0)
   
    const xScale = scaleLinear().domain([2, 3]).range([0, this.state.width])
    const yScale = scaleLinear().range([this.props.height, 1])

    const binGenerator = bin()
        .value(d => d.r0)
        .domain(xScale.domain())
        .thresholds(10)

    const bins = binGenerator(sorted_sims)
    // console.log(bins)

    const selectedBins = binGenerator(sorted_selected_sims)
    console.log(selectedBins)

    yScale.domain([0, max(bins, d => d.length)])

    this.setState({ xScale, yScale, binGenerator, bins, selectedBins })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.width !== prevState.width) {
      this.makeBins()
    }
    if (this.props.selectedSims !== prevProps.selectedSims) console.log(prevProps.selectedSims, this.props.selectedSims)
    if (this.props.selected !== prevProps.selected) console.log(prevProps.selected, this.props.selected)
    if (this.props.selectedSims !== prevProps.selectedSims || this.props.selected !== prevProps.selected) {
      const sorted_selected_sims = this.props.selectedSims.slice().sort((a,b) => a.r0 - b.r0)
      // console.log(sorted_selected_sims)
      const selectedBins = this.state.binGenerator(sorted_selected_sims)
      console.log(selectedBins)
      this.setState({ selectedBins })
      this.makeBins()
    }
  }

  render() {
    const { xScale, yScale, bins, selectedBins } = this.state;
      return (
        <div>
        {this.state.width && this.state.xScale &&
          <svg width={this.state.width} height={this.props.height}>
            <g>
              {bins.map( (bin,i) => {
                console.log('white', 'x0:', bin.x0,'length', bin.length, 'value', this.props.height - yScale(bin.length))
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
              console.log('blue', 'x0:', bin.x0, 'length', bin.length, 'value', this.props.height - yScale(bin.length))
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


