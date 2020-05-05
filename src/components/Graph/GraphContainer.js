import React, { Component } from 'react';
import Graph from '../Graph/Graph';
import Axis from './Axis';
import ThresholdLabel from '../Graph/ThresholdLabel';
import { scaleLinear, scaleUtc } from 'd3-scale';
import { max, extent } from 'd3-array';
import { margin } from '../../utils/constants';


class GraphContainer extends Component {
  constructor(props) {
      super(props);
      this.state = {
          children: [],
          // we need to define scales here in order to send to the yAxis
          scaleDomains: false,
          scales: {
            //   xScale: scaleUtc().range([margin.left, this.props.width - margin.right]),
            //   yScale: scaleLinear().range([this.props.height - margin.bottom, margin.top])
          }
      }
  }

  componentDidMount() {
      console.log('ComponentDidMount')
      const { width, height, seriesList, dates, scenario } = this.props;
      if (seriesList.length > 0) {

        const scales = this.getScales(seriesList, dates, width, height);
        const child = {
            'key': scenario.key,
            'graph': [],
        }
        
        child.graph.push(
            <Graph
                key={this.props.scenario}
                stat={this.props.stat}
                geoid={this.props.geoid}
                scenario={this.props.scenario}
                severity={this.props.severity}
                r0={this.props.r0}
                simNum={this.props.simNum}
                showConfBounds={this.props.showConfBounds}
                showActual={this.props.showActual}
                series={this.props.seriesList[0]}
                dates={this.props.dates}
                statThreshold={this.props.statThreshold}
                dateThreshold={this.props.dateThreshold}
                dateRange={this.props.dateRange}
                width={this.props.width}
                height={this.props.height}
                x={0}
                y={0}
                xScale={scales.xScale}
                yScale={scales.yScale}
            />
        )
        console.log(child)
        this.setState({
            scales,
            children: [child],
            scaleDomains: true
        })
      }
  }

  componentDidUpdate(prevProp, prevState) {

      const { scenarioList, seriesList, dates, height } = this.props;
      
      if (prevProp.scenarioList !== this.props.scenarioList) {
          console.log('componentDidUpdate Scenario List')
      }

      const newChildren = [];
      // technically both scenarioList and seriesList need to update
      // but seriesList is updated later so using it to enter componentDidUpdate
      if (prevProp.seriesList !== this.props.seriesList) {
          console.log('componentDidUpdate Series List')
          const adjWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;
          // need to adjust scale by length of scenario list
          // break these out into X and Y (X out of the loop, Y in?)
          const scales = this.getScales(seriesList, dates, adjWidth, height);

          for (let i = 0; i < scenarioList.length; i++) {
              const child = {
                  'key': scenarioList[i].key,
                  'graph': [],
              }
              child.graph.push(
                  <Graph
                      key={i}
                      stat={this.props.stat}
                      geoid={this.props.geoid}
                      scenario={this.props.scenarioList[i]}
                      severity={this.props.severity}
                      r0={this.props.r0}
                      simNum={this.props.simNum}
                      showConfBounds={this.props.showConfBounds}
                      showActual={this.props.showActual}
                      series={this.props.seriesList[i]}
                      dates={this.props.dates}
                      statThreshold={this.props.statThreshold}
                      dateThreshold={this.props.dateThreshold}
                      dateRange={this.props.dateRange}
                      width={adjWidth}
                      height={this.props.height}
                      x={i * adjWidth}
                      y={0}
                      xScale={scales.xScale}
                      yScale={scales.yScale}
                  />
              )
              newChildren.push(child);
          }
          this.setState({
            scales,
            children: newChildren,
          })
      }
  }

//   getXScale = (dates, width) => {
//       const timeDomain = extent(dates);
//       const xScale = scaleUtc().range([margin.left, width - margin.right])
//                                .domain(timeDomain);
//       return xScale
//   }

//   getYScale = (seriesList, height) => {
//       let scaleMaxVal = 0
//       for (let i = 0; i < seriesList.length; i++) {
//           const seriesMaxVal = max(seriesList[i], sims => max(sims.vals));
//           if (seriesMaxVal > scaleMaxVal) scaleMaxVal = seriesMaxVal
//       }
//       const yScale = scaleLinear().range([height - margin.bottom, margin.top])
//                                   .domain([0, scaleMaxVal]).nice();
//       return yScale
//   }

  getScales = (seriesList, dates, width, height) => {
      // calculate scale domains
      const timeDomain = extent(dates);
      let scaleMaxVal = 0
      for (let i = 0; i < seriesList.length; i++) {
          const seriesMaxVal = max(seriesList[i], sims => max(sims.vals));
          if (seriesMaxVal > scaleMaxVal) scaleMaxVal = seriesMaxVal
      }
      // set scale ranges to width and height of container
      const xScale = scaleUtc().range([margin.left, width - margin.right])
                               .domain(timeDomain);
      const yScale = scaleLinear().range([height - margin.bottom, margin.top])
                                  .domain([0, scaleMaxVal]).nice();

      return { xScale, yScale }
  }

  render() {
      const { children } = this.state;
      return (
               
          <div className="graph-wrapper">
              <div className="y-axis-label titleNarrow">
                  {this.props.yAxisLabel}
              </div>
              <div className="row">
                  {children.map( (child, i) => {
                      return (
                          <div key={`${child.key}-label`}>
                              <ThresholdLabel
                                  statThreshold={this.props.statThreshold}
                                  dateThreshold={this.props.dateThreshold}
                                  percExceedence={this.props.percExceedenceList[i]}
                              />
                          </div>
                      )
                  })}
              </div>
              <div className="row">
                  {this.state.scaleDomains &&
                  <svg 
                  width={this.props.width} 
                  height={this.props.height} 
                    >
                        <Axis 
                        width={this.props.width}
                        height={this.props.height}
                        orientation={'left'}
                        scale={this.state.scales.yScale}
                        x={margin.left}
                        y={0}
                        />
                        {children.map(child => {
                            return (
                                <g key={`${child.key}-graph`}>
                                    {child.graph}
                                </g>
                            )
                            
                        })}
                    </svg>
                  }
              </div>
          </div>
      )
  }
}

export default GraphContainer;