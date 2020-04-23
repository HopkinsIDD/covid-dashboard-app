import React, { Component } from 'react'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { line } from 'd3-shape'
import { max, extent, bisectLeft, least } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import { timeFormat } from 'd3-time-format'
import { select, clientPoint } from 'd3-selection'
import { numberWithCommas } from '../store/utils.js'

// TODO: Make graph responsive based on passing props in
const width = 850;
const height = 350;
const margin = { top: 20, right: 40, bottom: 30, left: 50 };
const green = '#4ddaba';

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            dates: [],
            xScale: scaleUtc().range([margin.left, width - margin.right]),
            yScale: scaleLinear().range([height - margin.bottom, margin.top]),
            lineGenerator: line().defined(d => !isNaN(d))
        };
        this.xAxisRef = React.createRef();
        this.xAxis = axisBottom().scale(this.state.xScale)
            .tickFormat(timeFormat('%b'))
            .ticks(width / 80).tickSizeOuter(0);

        this.yAxisRef = React.createRef();
        this.yAxis = axisLeft().scale(this.state.yScale)
            .tickFormat(d => numberWithCommas(d));
    }
    
    componentDidMount() {
        // console.log(this.props.data);
        if (this.xAxisRef.current) {
            select(this.xAxisRef.current).call(this.xAxis)
        }
        if (this.yAxisRef.current) {
            select(this.yAxisRef.current).call(this.yAxis).call(g => g.select(".domain").remove());
        }
    }

    componentDidUpdate() {
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
        const { data } = nextProps;
        const { xScale, yScale, lineGenerator } = prevState;
        console.log(data)

        // data has changed, so recalculate scale domains
        const timeDomain = extent(data.dates);
        console.log(timeDomain)
        const maxVal = max(data.series, sims => max(sims.map( d => max(d.values))))
        console.log(maxVal)

        xScale.domain(timeDomain);
        yScale.domain([0, maxVal]).nice();
        lineGenerator.x((d,i) => xScale(data.dates[i]))
        lineGenerator.y(d => yScale(d.values ))

        const simPaths = data.series.map( (d, i) => {
            console.log(Object.values(d)[i]['values'])
            return lineGenerator(Object.values(d)[i])
            // return sims.map( sim => {
            //     // console.log(sim)
            //     return lineGenerator(sim.values)
            // })
        })
        // const simPaths = lineGenerator(data.series)
        console.log(simPaths)

        return { simPaths, series: data.series, dates: data.dates };
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

    render() {
        // return(
        //     <div className="graph border">
        //         <p>GeoID: {this.props.geoid}</p>
        //         <p>Stat: {this.props.stat}</p>
        //         <p>Scenario: {this.props.scenario}</p>
        //         <p>Severity: {this.props.severity}</p>
        //         <p>r0: {this.props.r0}</p>
        //         <p>Number of Simulations: {this.props.simNum}</p>
        //         <p>Confidence: {this.props.showConfBounds}</p>
        //         <p>Actual: {this.props.showActual}</p>
        //     </div>
        // )

        return (
        <div className="graph border">
            <svg width={width} height={height}>
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
                <g ref={this.xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
                <g ref={this.yAxisRef} transform={`translate(${margin.left}, 0)`} />
            </g>
            </svg>
        </div>
        )
    }
}

export default Graph