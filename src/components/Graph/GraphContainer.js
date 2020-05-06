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
          scales: {},
          scaleDomains: false,
          scenarioChange: false,
          graphWidth: 0
      }
  }

  componentDidMount() {
      console.log('ComponentDidMount')
      const { width, height, seriesList, dates, scenarioList } = this.props;
      if (seriesList.length > 0) {
        const graphWidth = scenarioList.length === 2 ? width / 2 : width;
        const scales = this.getScales(seriesList, dates, graphWidth, height);
        const child = {
            'key': scenarioList[0].key,
            'graph': [],
        }
        
        child.graph.push(
            <Graph
                key={scenarioList[0].key}
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
                width={graphWidth}
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
            scaleDomains: true,
            graphWidth
        })
      }
  }

  componentDidUpdate(prevProp, prevState) {

      const { scenarioList, seriesList, dates, height } = this.props;
      const newChildren = [];
    
      // technically both scenarioList and seriesList need to update
      // but seriesList is updated later so using it to enter componentDidUpdate
      // the way to check if scenarioList has changed is by comparing lengths of seriesList
      // scenarioList updates happen then are immediately followed by seriesList update so can't rely on scenarioList check
      // if the seriesList has changed, we want to remove existing graphs before drawing / updating
      if (prevProp.seriesList !== this.props.seriesList) {
            
            const graphWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;
            // need to adjust scale by length of scenario list
            // break these out into X and Y (X out of the loop, Y in?)
            const scales = this.getScales(seriesList, dates, graphWidth, height);

            // seriesList has updated AND scenarioList has changed
            if (prevProp.seriesList.length !== this.props.seriesList.length) {
                console.log('componentDidUpdate Series List - scenarioList change');
                const scenarioChange = true;
                for (let i = 0; i < scenarioList.length; i++) {
                    const child = {
                        'key': scenarioList[i].key,
                        'graph': [],
                    }
                    child.graph.push(
                        <Graph
                            key={`graph${i+1}`}
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
                            brushActive={this.props.brushActive}
                            width={graphWidth}
                            height={this.props.height}
                            x={i * graphWidth}
                            y={0}
                            xScale={scales.xScale}
                            yScale={scales.yScale}
                            scenarioChange={scenarioChange}
                        />
                    )
                    newChildren.push(child);
                }
                this.setState({
                  scales,
                  graphWidth,
                  children: newChildren,
                  scenarioChange
                })
            } 
            // seriesList has updated AND scenarioList has NOT changed  
            else {
                console.log('componentDidUpdate Series List - no scenarioList change');
                const scenarioChange = false;
                for (let i = 0; i < scenarioList.length; i++) {
                    const child = {
                        'key': scenarioList[i].key,
                        'graph': [],
                    }
                    child.graph.push(
                        <Graph
                            key={`graph${i+1}`}
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
                            brushActive={this.props.brushActive}
                            width={this.state.graphWidth}
                            height={this.props.height}
                            x={i * this.state.graphWidth}
                            y={0}
                            xScale={scales.xScale}
                            yScale={scales.yScale}
                            scenarioChange={scenarioChange}
                        />
                    )
                    newChildren.push(child);
                }
                this.setState({
                  scales,
                  graphWidth,
                  children: newChildren,
                  scenarioChange
                })
            }
                
      }
      if (prevProp.seriesList !== this.props.seriesList && prevProp.seriesList.length === this.props.seriesList.length) {
          console.log('componentDidUpdate Series List')
          console.log('prev SeriesList is', prevProp.seriesList.length, 'next SeriesList is', this.props.seriesList.length)
          


      }
  }

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
    //   const { scenarioList, width } = this.props;
    //   const adjWidth = scenarioList.length === 2 ? width / 2 : width;
      return (
               
          <div className="graph-wrapper">
              <div className="y-axis-label titleNarrow">
                  {this.props.yAxisLabel}
              </div>
              <div className="row">
                    {children.map( (child, i) => {
                        return (
                            (this.props.scenarioList && this.props.scenarioList.length === 2) ?
                                <ThresholdLabel
                                    key={`${child.key}-label`}
                                    classProps={'col-6 filter-label threshold-label callout'}
                                    statThreshold={this.props.statThreshold}
                                    dateThreshold={this.props.dateThreshold}
                                    percExceedence={this.props.percExceedenceList[i]}
                                />
                            :
                                <ThresholdLabel
                                    key={`${child.key}-label`}
                                    classProps={'col-12 filter-label threshold-label callout'}
                                    statThreshold={this.props.statThreshold}
                                    dateThreshold={this.props.dateThreshold}
                                    percExceedence={this.props.percExceedenceList[i]}
                                />
                        )
                    })}
              </div>
              <div className="row">
                  {this.state.scaleDomains &&
                  <svg 
                //   width={this.props.width} 
                  width={this.props.width}
                  height={this.props.height} 
                    >
                        <Axis 
                        width={this.state.graphWidth}
                        height={this.props.height}
                        orientation={'left'}
                        scale={this.state.scales.yScale}
                        x={margin.left}
                        y={0}
                        transition={!this.state.scenarioChange}
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