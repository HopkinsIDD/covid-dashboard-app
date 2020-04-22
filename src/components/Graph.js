import React, { Component } from 'react'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { line } from 'd3-shape'
import { max, extent } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'

const width = 850;
const height = 350;
const margin = { top: 20, right: 40, bottom: 30, left: 50 };
const green = '#4ddaba'

class Graph extends Component {
    // constructor(props) {
    //     super(props);
        state = {
            series: [],
            dates: [],
            xScale: scaleUtc().range([margin.left, width - margin.right]),
            yScale: scaleLinear().range([height - margin.bottom, margin.top]),
            lineGenerator: line().defined(d => !isNaN(d))
        }

        // xAxis = 
    // }

    componentDidMount() {
        // console.log(this.props.data);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
        const { data } = nextProps;
        const { xScale, yScale, lineGenerator } = prevState;

        console.log(data)

        // data has changed, so recalculate scale domains
        const timeDomain = extent(data.dates);
        const maxVal = max(data.series, d => max(Object.values(d)[0]));
        console.log(timeDomain)
        console.log(maxVal)
        xScale.domain(timeDomain);
        yScale.domain([0, maxVal]).nice();
        lineGenerator.x((d,i) => xScale(data.dates[i]))
        lineGenerator.y(d => yScale(d))
        const simPaths = data.series.map( ds => {
            console.log(Object.values(ds)[0])
            return lineGenerator(Object.values(ds)[0])
        })
        console.log(simPaths)

        return { simPaths };
    }

    componentDidUpdate() {

    }

    render() {

            //     <div className="graph border">
            //     <p>GeoID: {this.props.geoid}</p>
            //     <p>Stat: {this.props.stat}</p>
            //     <p>Scenario: {this.props.scenario}</p>
            //     <p>Severity: {this.props.severity}</p>
            //     <p>r0: {this.props.r0}</p>
            //     <p>Number of Simulations: {this.props.simNum}</p>
            //     <p>Confidence: {this.props.showConfBounds}</p>
            //     <p>Actual: {this.props.showActual}</p>
            // </div>

        return (
        <div className="graph border">
            <svg width={width} height={height}>
                <path d={this.state.simPaths} fill='none' stroke={green} strokeWidth='2' />
            </svg>
        </div>
        )
    }
}

export default Graph