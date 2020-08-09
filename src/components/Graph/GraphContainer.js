import React, { Component, Fragment } from 'react';
import Graph from '../Graph/Graph';
import Axis from './Axis';
import ThresholdLabel from '../Graph/ThresholdLabel.tsx';
import { scaleLinear, scaleUtc } from 'd3-scale';
import { max, extent } from 'd3-array';
import { formatTitle } from '../../utils/utils';
import { margin } from '../../utils/constants';
import { COUNTIES } from '../../utils/geoids.tsx';


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
      const { width, height, seriesList, selectedDates, scenarioList } = this.props;
      if (seriesList.length > 0) {
        const graphWidth = scenarioList.length === 2 ? width / 2 : width;
        const graphHeight = height;
        const scales = this.getScales(seriesList, selectedDates, graphWidth, height);

        this.setState({scaleDomains: true});
        this.updateGraphs(scenarioList, graphWidth, graphHeight, scales);
      }
  }

  componentDidUpdate(prevProp) {

    const { scenarioList, seriesList, selectedDates, height } = this.props;

    // this deals with re-scaling and re-drawing graphs on window resize
    if (prevProp.width !== this.props.width || prevProp.height !== this.props.height) {
        const graphWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;
        const graphHeight = height;
        // need to adjust scale by length of scenario list
        // break these out into X and Y (X out of the loop, Y in?)
        const scales = this.getScales(seriesList, selectedDates, graphWidth, graphHeight);
        this.updateGraphs(scenarioList, graphWidth, graphHeight, scales);
    }
    // technically both scenarioList and seriesList need to update
    // but seriesList is updated later so using it to enter componentDidUpdate
    // scenarioList updates happen then are immediately followed by seriesList update so can't rely on scenarioList check
    // if the seriesList has changed, we want to remove existing graphs before drawing / updating
    // the way to solve this is by keeping track of scenarioChange click events and putting those in the graph keys
    // so that when the click events increment the keys change and the graph component remounts
    if (prevProp.seriesList !== this.props.seriesList ||
        prevProp.showConfBounds !== this.props.showConfBounds ||
        prevProp.showActual !== this.props.showActual) {
        const graphWidth = scenarioList.length === 2 ? this.props.width / 2 : this.props.width;
        const graphHeight = height;
        // need to adjust scale by length of scenario list
        // break these out into X and Y (X out of the loop, Y in?)
        const scales = this.getScales(seriesList, selectedDates, graphWidth, graphHeight);
        this.updateGraphs(scenarioList, graphWidth, graphHeight, scales);
    }
}

  updateGraphs = (scenarioList, graphWidth, graphHeight, scales) => {
    const children = [];
    const { scenarioClickCounter } = this.props;
    for (let i = 0; i < scenarioList.length; i++) {
        const showLegend = scenarioList.length === 1 ||
            (scenarioList.length > 1 && i === 1) ? true : false;
        const child = {
            key: `${scenarioList[i].key}_Graph_${scenarioClickCounter}`,
            graph: [],
        }
        child.graph.push(
            <Graph
                key={`${scenarioList[i].key}_Graph_${scenarioClickCounter}`}
                keyVal={`${scenarioList[i].key}_Graph_${scenarioClickCounter}`}
                indicator={this.props.indicator}
                geoid={this.props.geoid}
                scenario={this.props.scenarioList[i]}
                severity={this.props.severity}
                r0={this.props.r0}
                animateTransition={this.props.animateTransition}
                showConfBounds={this.props.showConfBounds}
                confBounds={this.props.confBoundsList[i]}
                showActual={this.props.showActual}
                actual={this.props.actualList[i]}
                series={this.props.seriesList[i]}
                selectedDates={this.props.selectedDates}
                indicatorThreshold={this.props.indicatorThreshold}
                dateThreshold={this.props.dateThreshold}
                brushActive={this.props.brushActive}
                width={graphWidth}
                height={graphHeight}
                showLegend={showLegend}
                x={0}
                y={0}
                xScale={scales.xScale}
                yScale={scales.yScale}
            />
        )
        children.push(child);
    }
    this.setState({
        scales,
        graphWidth,
        graphHeight,
        children,
    })
}

  getScales = (seriesList, selectedDates, width, height) => {
    // calculate scale domains
    const timeDomain = extent(selectedDates);
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
      const { scenarioList, scenarioHovered, width, indicator } = this.props;
      const countyName = `${COUNTIES[this.props.geoid]}`;
      const dimensions = { width: margin.yAxis + margin.left, height: 40};

      return (
          <div className="graph-wrapper">
              <div className="y-axis-label titleNarrow graph-yLabel">
                  {`Daily ${indicator.name}`}
              </div>
              <div className="graph-title-row">

              <div style={dimensions}></div>
                {scenarioList.map((scenario, i) => {
                    const scenarioTitle = formatTitle(scenario.name);
                    const isActive = scenario.name === scenarioHovered ? ' title-active' : '';
                    return (scenarioList && scenarioList.length > 1) ?
                            <div key={scenario.key} style={{ width: width - margin.right}}>
                                <div className={"scenario-title titleNarrow"}>{countyName}</div>
                                <div className={"scenario-title" + isActive}>{scenarioTitle}</div>
                            </div>
                         :
                            <div key={scenario.key} style={{ width: width - margin.right}}>
                                <div className="scenario-title titleNarrow">{countyName}</div>
                                <div className="scenario-title">{scenarioTitle}</div>
                            </div>
                } )}
            </div>
              <div className="graph-title-row callout-row">
                <div style={dimensions}></div>
                    {children.map( (child, i) => {
                        return (
                            scenarioList &&
                            <ThresholdLabel
                                key={`${child.key}-label`}
                                classProps={'filter-label threshold-label callout'}
                                indicatorThreshold={this.props.indicatorThreshold}
                                dateThreshold={this.props.dateThreshold}
                                percExceedence={this.props.percExceedenceList[i]}
                                label={indicator.name.toLowerCase()}
                                r0full={this.props.r0full}
                                r0selected={this.props.r0selected}
                                statSliderActive={this.props.statSliderActive}
                                dateSliderActive={this.props.dateSliderActive} />
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
                </Fragment>}
                </div>
          </div>
      )
  }
}

export default GraphContainer;
