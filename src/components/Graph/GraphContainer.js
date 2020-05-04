import React, { Component } from 'react';
import Graph from '../Graph/Graph';
import Axis from './Axis';
import { scaleLinear, scaleUtc } from 'd3-scale';
import { max, extent } from 'd3-array';
import { margin } from '../../utils/constants';


class GraphContainer extends Component {
  constructor(props) {
      super(props);
      this.state = {
          children = [],
          scales = [],
      }
  }

  componentDidMount() {
      const { width, height, series, dates, scenario } = this.props;
      const scales = this.getScales(series, dates, width, height);

      const child = {
          'key': scenario.key,
          'graph': [],
      }
      child.graph.push(
          <Graph
              key={this.props.scenario}
              stat={this.props.stat}
              geoid={this.props.geoid}
              scenario={this.props.scenarioList}
              severity={this.props.severity}
              r0={this.props.r0}
              simNum={this.props.simNum}
              showConfBounds={this.props.showConfBounds}
              showActual={this.props.showActual}
              series={this.props.series}
              dates={this.props.dates}
              statThreshold={this.props.statThreshold}
              dateThreshold={this.props.dateThreshold}
              dateRange={this.props.dateRange}
              width={this.props.width}
              height={this.props.height}
              xScale={scales.xScale}
              yScale={scales.yScale}
          />
      )
      this.setState({
          scales,
          children: [child]
      })
  }

  componenDidUpdate(prevProp, prevState) {
      const { scenarioList } = this.props;
      const newChildren = [];
          // technically both scenarioList and seriesList need to update
      // but seriesList is updated later so using it to enter componentDidUpdate
      if (prevProp.seriesList !== this.props.seriesList) {
          console.log('componentDidUpdate')
          const adjWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;

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
                      xScale={this.state.scales.xScale}
                      yScale={this.state.scales.yScale}
                  />
              )
              newChildren.push(child);
          }
          this.setState({
              children: newChildren
          })
      }
  }

  getScales = (series, dates, width, height) => {
      // calculate scale domains
      const timeDomain = extent(dates);
      const maxVal = max(series, sims => max(sims.vals));
      // set scale ranges to width and height of container
      const xScale = scaleUtc().range([margin.left, width - margin.right])
                               .domain(timeDomain);
      const yScale = scaleLinear().range([height - margin.bottom, margin.top])
                                  .domain([0, maxVal]).nice();

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
                  {children.map(child => {
                      return (
                          <div key={`${child.key}-label`}>
                              <ThresholdLabel
                                  statThreshold={this.props.statThreshold}
                                  dateThreshold={this.props.dateThreshold}
                                  percExceedence={this.props.percExceedence}
                              />
                          </div>
                      )
                  })}
              </div>
              <div className="row">
                <svg >
                  <Axis 
                    width={this.state.width}
                    height={this.state.height}
                    orientation={'left'}
                    scale={this.state.yScale}
                    x={margin.left}
                    y={0}
                  />
                {children.map(child => {child.graph})}
                </svg>
              
              </div>
          </div>
      )
  }
}

export default GraphContainer;