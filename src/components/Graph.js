import React, { Component } from 'react'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { line } from 'd3-shape'
import { max, extent, bisectLeft, least } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import { timeFormat } from 'd3-time-format'
import { select, clientPoint } from 'd3-selection'
import { numberWithCommas } from '../store/utils.js'

// TODO: Make graph responsive based on passing props in
// const width = document.getElementById('graph-container').getBoundingClientRect().width;
// const height = document.getElementById('graph-container').getBoundingClientRect().height;
// const width = 800;
// const height = 350;
const margin = { top: 20, right: 40, bottom: 30, left: 50 };
const green = '#4ddaba';

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            series: this.props.series,
            dates: this.props.dates,
            xScale: scaleUtc().range([margin.left, this.props.width - margin.right]),
            yScale: scaleLinear().range([this.props.height - margin.bottom, margin.top]),
            lineGenerator: line().defined(d => !isNaN(d)),
            simPaths: [],
        };
        this.xAxisRef = React.createRef();
        this.xAxis = axisBottom().scale(this.state.xScale)
            .tickFormat(timeFormat('%b'))
            .ticks(this.state.width / 80).tickSizeOuter(0);

        this.yAxisRef = React.createRef();
        this.yAxis = axisLeft().scale(this.state.yScale)
            .tickFormat(d => numberWithCommas(d));
    }
    
    componentDidMount() {
        // const width = this.divElement.clientWidth;
        // const height = this.divElement.clientHeight;
        // this.setState({ width, height });

        this.drawSimPaths(this.state.series, this.state.dates);

        if (this.xAxisRef.current) {
            select(this.xAxisRef.current).call(this.xAxis)
        }
        if (this.yAxisRef.current) {
            select(this.yAxisRef.current).call(this.yAxis).call(g => g.select(".domain").remove());
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // compare prevProps to newProps
        if (this.props.series !== prevProps.series) {
            const { series, dates } = this.props;
            const { xScale, yScale, lineGenerator } = prevState;
            this.drawSimPaths(series, dates)
        }

        // Update Axes
        if (this.xAxisRef.current) {
            select(this.xAxisRef.current)
            //   .transition()
              .call(this.xAxis);
        }
        if (this.yAxisRef.current) {
            select(this.yAxisRef.current)
            //   .transition()
              .call(this.yAxis)
              .call(g => g.select(".domain").remove());
        }
    }

    drawSimPaths = (series, dates) => {
        // draw the sims first here (without transitioning)
        const { xScale, yScale, lineGenerator, width, height } = this.state;
        console.log(series)
        // calculate scale domains
        const timeDomain = extent(dates);
        console.log(timeDomain)
        // const maxVal = max(series, sims => max(sims.map( d => max(d.values))))
        const maxVal = max(series, sims => max(sims.values))
        console.log(maxVal)
        // set scale ranges to width and height of container
        xScale.range([margin.left, width - margin.right])
        yScale.range([height - margin.bottom, margin.top])
        // set scale domains and lineGenerator domains
        xScale.domain(timeDomain);
        yScale.domain([0, maxVal]).nice();
        lineGenerator.x((d,i) => xScale(dates[i]))
        lineGenerator.y(d => yScale(d))
        // generate simPaths from lineGenerator
        
        const simPaths = series.map( d => {
            // lily messed up something here...
            // console.log(i, d.values)
            // console.log(Object.values(d)[i])
            return lineGenerator(Object.values(d).values)
        })
        // set new values to state
        this.setState({ 
            series: series,
            dates: dates,
            xScale: xScale,
            yScale: yScale,
            lineGenerator: lineGenerator,
            simPaths: simPaths,
        })
    }

    handleMouseMove = (event) => {
        console.log(clientPoint(event.target, event))
        
        // console.log(this)
        // const ym = this.state.yScale.invert(clientPoint[1]);
        // const xm = this.state.xScale.invert(clientPoint[0]);
        // const i1 = bisectLeft(this.state.dates, xm, 1);
        // const i0 = i1 - 1;
        // const i = xm - this.state.dates[i0] > this.state.dates[i1] - xm ? i1 : i0;
        // const s = least(this.state.series, d => Math.abs(d.values[i] - ym));
    }

    handleMouseEnter = (event) => {
        
    }

    handleMouseLeave = (event) => {
        
    }

    render() {
        return (
            <div>
                <svg width={this.state.width} height={this.state.height}>
                    <path 
                        d={this.state.simPaths}
                        fill='none' 
                        stroke={green} 
                        strokeWidth='1'
                        onMouseMove={this.handleMouseMove}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                    />
                <g>
                    <g ref={this.xAxisRef} transform={`translate(0, ${this.state.height - margin.bottom})`} />
                    <g ref={this.yAxisRef} transform={`translate(${margin.left}, 0)`} />
                </g>
                </svg>
            </div>
        )
    }
}

export default Graph