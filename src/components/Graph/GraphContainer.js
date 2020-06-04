import React, { Component, Fragment } from 'react';
import Graph from '../Graph/Graph';
import Axis from './Axis';
import ThresholdLabel from '../Graph/ThresholdLabel';
import { scaleLinear, scaleUtc } from 'd3-scale';
import { max, extent } from 'd3-array';
import { margin, COUNTYNAMES } from '../../utils/constants';
import { formatTitle } from '../../utils/utils';

class GraphContainer extends Component {
  constructor(props) {
      super(props);
      this.state = {
          children: [],
          scales: {},
          scaleDomains: false,
          graphWidth: 0,
          graphHeight: 0,
      }
  }

  componentDidMount() {
    //   console.log('ComponentDidMount')
      const { width, height, seriesList, confBoundsList, dates, scenarioList } = this.props;
      if (seriesList.length > 0) {
        const graphWidth = scenarioList.length === 2 ? width / 2 : width;
        const graphHeight = height;
        const scales = this.getScales(seriesList, confBoundsList, dates, graphWidth, height);
        const child = {
            key: `${scenarioList[0].key}_Graph_${this.props.scenarioClickCounter}`,
            graph: [],
        }
        
        child.graph.push(
            <Graph
                key={`${scenarioList[0].key}_Graph_${this.props.scenarioClickCounter}`}
                keyVal={`${scenarioList[0].key}_Graph_${this.props.scenarioClickCounter}`}
                geoid={this.props.geoid}
                series={this.props.seriesList[0]}
                dates={this.props.dates}
                scenario={this.props.scenario}
                severity={this.props.severity}
                stat={this.props.stat}
                r0={this.props.r0}
                animateTransition={this.props.animateTransition}
                toggleAnimateTransition={this.props.toggleAnimateTransition}
                simNum={this.props.simNum}
                showConfBounds={this.props.showConfBounds}
                confBounds={this.props.confBoundsList[0]}
                statThreshold={this.props.statThreshold}
                dateThreshold={this.props.dateThreshold}
                dateRange={this.props.dateRange}
                width={graphWidth}
                height={graphHeight}
                showLegend={true}
                x={0}
                y={0}
                xScale={scales.xScale}
                yScale={scales.yScale}
            />
        )
        // console.log(child)
        this.setState({
            scales,
            children: [child],
            scaleDomains: true,
            graphWidth,
            graphHeight
        })
      }
  }

  componentDidUpdate(prevProp, prevState) {

      const { scenarioList, seriesList, confBoundsList, dates, height } = this.props;
      const newChildren = [];

      // this deals with re-scaling and re-drawing graphs on window resize
      if (prevProp.width !== this.props.width || prevProp.height !== this.props.height) {
        // console.log('componentDidUpdate width');
        const graphWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;
        const graphHeight = height;
        // console.log('graphWidth is', graphWidth)
        // need to adjust scale by length of scenario list
        // break these out into X and Y (X out of the loop, Y in?)
        const scales = this.getScales(seriesList, confBoundsList, dates, graphWidth, graphHeight);
        this.updateGraphChildren(newChildren, scenarioList, graphWidth, graphHeight, scales);
      }

      // technically both scenarioList and seriesList need to update
      // but seriesList is updated later so using it to enter componentDidUpdate
      // scenarioList updates happen then are immediately followed by seriesList update so can't rely on scenarioList check
      // if the seriesList has changed, we want to remove existing graphs before drawing / updating
      // the way to solve this is by keeping track of scenarioChange click events and putting those in the graph keys
      // so that when the click events increment the keys change and the graph component remounts
      if (prevProp.seriesList !== this.props.seriesList || prevProp.showConfBounds !== this.props.showConfBounds) {
        // console.log('seriesList change, seriesList is', seriesList.length)
        const graphWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;
        const graphHeight = height;
        // console.log('graphWidth is', graphWidth)
        // need to adjust scale by length of scenario list
        // break these out into X and Y (X out of the loop, Y in?)
        const scales = this.getScales(seriesList, confBoundsList, dates, graphWidth, graphHeight);
        this.updateGraphChildren(newChildren, scenarioList, graphWidth, graphHeight, scales);
    }
}

  updateGraphChildren = (newChildren, scenarioList, graphWidth, graphHeight, scales) => {
        // console.log('componentDidUpdate Series List - scenarioList change');
        // console.log(this.props.confBoundsList)
        for (let i = 0; i < scenarioList.length; i++) {
            const child = {
                key: `${scenarioList[i].key}_Graph_${this.props.scenarioClickCounter}`,
                graph: [],
            }
            child.graph.push(
                <Graph
                    key={`${scenarioList[i].key}_Graph_${this.props.scenarioClickCounter}`}
                    keyVal={`${scenarioList[i].key}_Graph_${this.props.scenarioClickCounter}`}
                    stat={this.props.stat}
                    geoid={this.props.geoid}
                    scenario={this.props.scenarioList[i]}
                    severity={this.props.severity}
                    r0={this.props.r0}
                    animateTransition={this.props.animateTransition}
                    toggleAnimateTransition={this.props.toggleAnimateTransition}
                    simNum={this.props.simNum}
                    showConfBounds={this.props.showConfBounds}
                    confBounds={this.props.confBoundsList[i]}
                    showActual={this.props.showActual}
                    series={this.props.seriesList[i]}
                    dates={this.props.dates}
                    statThreshold={this.props.statThreshold}
                    dateThreshold={this.props.dateThreshold}
                    dateRange={this.props.dateRange}
                    brushActive={this.props.brushActive}
                    width={graphWidth}
                    height={graphHeight}
                    showLegend={scenarioList.length === 1 || (scenarioList.length > 1 && i === 1) ? true : false }
                    // x={i * graphWidth}
                    x={0}
                    y={0}
                    xScale={scales.xScale}
                    yScale={scales.yScale}
                />
            )
            newChildren.push(child);
        }
        this.setState({
            scales,
            graphWidth,
            graphHeight,
            children: newChildren,
        })        
    }


  getScales = (seriesList, confBoundsList, dates, width, height) => {
      // calculate scale domains
      const timeDomain = extent(dates);
      let scaleMaxVal = 0
      for (let i = 0; i < seriesList.length; i++) {
          const seriesMaxVal = max(seriesList[i], sims => max(sims.vals));
          if (seriesMaxVal > scaleMaxVal) scaleMaxVal = seriesMaxVal

        //   if (confBoundsList && confBoundsList.length > 0) {
        //       console.log(confBoundsList[i])
        //     const confBoundMaxVal = max(confBoundsList[i], cb => cb.p90)
        //     if (confBoundMaxVal > scaleMaxVal) scaleMaxVal = confBoundMaxVal
        //   }
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
      const { scenarioList, scenarioHovered } = this.props;
      const countyName = `${COUNTYNAMES[this.props.geoid]}`;
      return (
          <div className="graph-wrapper">
              <div className="y-axis-label titleNarrow graph-yLabel">
                  {`Daily ${this.props.stat.name}`}
              </div>
              <div className="graph-title-row">
              
              <div style={{ width: margin.yAxis + margin.left, height: 40}}></div>
                {scenarioList.map((scenario, i) => {
                    const scenarioTitle = formatTitle(scenario.name);
                    const isActive = scenario.name === scenarioHovered ? ' title-active' : '';
                    return (this.props.scenarioList && scenarioList.length > 1) ? 
                            <div key={scenario.key} style={{ width: this.props.width - margin.right}}>
                                <div className={"scenario-title titleNarrow"}>{countyName}</div> 
                                <div className={"scenario-title" + isActive}>{scenarioTitle}</div>
                            </div>
                         :
                            <div key={scenario.key} style={{ width: this.props.width - margin.right}}>
                                <div className="scenario-title titleNarrow">{countyName}</div> 
                                <div className="scenario-title">{scenarioTitle}</div>
                            </div>
                } )}
            </div>
              <div className="graph-title-row callout-row">
                <div style={{ width: margin.yAxis + margin.left, height: 40}}></div>
                    {children.map( (child, i) => {
                        return (
                            (this.props.scenarioList && this.props.scenarioList.length === 2) ?
                                <ThresholdLabel
                                    key={`${child.key}-label`}
                                    classProps={'filter-label threshold-label callout'}
                                    statThreshold={this.props.statThreshold}
                                    dateThreshold={this.props.dateThreshold}
                                    percExceedence={this.props.percExceedenceList[i]}
                                    label={this.props.stat.name.toLowerCase()}
                                    r0={this.props.r0}
                                    statSliderActive={this.props.statSliderActive}
                                    dateSliderActive={this.props.dateSliderActive}
                                />
                            :

                                <ThresholdLabel
                                    key={`${child.key}-label`}
                                    classProps={'filter-label threshold-label callout'}
                                    statThreshold={this.props.statThreshold}
                                    dateThreshold={this.props.dateThreshold}
                                    percExceedence={this.props.percExceedenceList[i]}
                                    label={this.props.stat.name.toLowerCase()}
                                    r0={this.props.r0}
                                    statSliderActive={this.props.statSliderActive}
                                    dateSliderActive={this.props.dateSliderActive}
                                />
                        )
                    })}
                </div>
                <div className="graph-container">
                  {this.state.scaleDomains &&
                  <Fragment>
                        <svg 
                            width={margin.yAxis}
                            height={this.props.height} 
                        >
                        <Axis 
                            width={this.state.graphWidth}
                            height={this.props.height}
                            orientation={'left'}
                            scale={this.state.scales.yScale}
                            x={margin.yAxis}
                            y={0}
                        />
                        </svg>
                        {children.map(child => {
                            return (
                                <svg 
                                    key={`graphSVG_${child.key}`}
                                    width={this.state.graphWidth}
                                    height={this.state.graphHeight}
                                    className={`graphSVG_${child.key}`}
                                >
                                <g key={`${child.key}-graph`}>
                                    {child.graph}
                                </g>
                                </svg>
                            )
                        })}
            
                </Fragment>
                }
                </div>
          </div>
      )
  }
}

export default GraphContainer;