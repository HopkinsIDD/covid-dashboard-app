import React, { Component, Fragment } from 'react';
import Chart from '../Chart/Chart';
import SummaryLabel from '../Chart/SummaryLabel';
// import { scaleLinear } from 'd3-scale';
import { COUNTYNAMES, scenarioColors, blue } from '../../utils/constants'
import { getReadableDate } from '../../utils/utils'

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: depending on performance, may add more or less
            parameters: ['incidI', 'incidH', 'incidICU', 'incidD'],
            parameterLabels: ['Infections', 'Hospitalizations', 'ICU Cases', 'Deaths'],
            // severities: ['high', 'med', 'low'],
            children: {'incidI': {}, 'incidH': {}, 'incidICU': {}, 'incidD': {}},
            hoveredScenarioIdx: null
        }
    }

    componentDidMount() {
        this.drawSummaryStatCharts();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.summaryStart !== this.props.summaryStart 
            || prevProps.summaryEnd !== this.props.summaryEnd
            || prevProps.dataset !== this.props.dataset
            || prevProps.scenarios !== this.props.scenarios
            || prevProps.scale !== this.props.scale
            || prevProps.width !== this.props.width 
            || prevProps.height !== this.props.height) {
            console.log('ComponentDidUpdate Summary Start or End or Dataset')
            this.drawSummaryStatCharts();
        }
    }

    drawSummaryStatCharts = () => {
        const { children } = this.state;
        const { summaryStart, summaryEnd } = this.props;
            
        for (let [index, param] of this.state.parameters.entries()) {

            // for (let severity of this.state.severities) {
                const child = {
                    key: `${param}-chart`,
                    chart: {},
                }

                child.chart = 
                    <Chart
                        key={`${param}-chart`}
                        dataset={this.props.dataset}
                        scenarios={this.props.scenarios}
                        firstDate={this.props.firstDate}
                        summaryStart={this.props.summaryStart}
                        summaryEnd={this.props.summaryEnd}
                        // severity={severity}
                        stat={param}
                        statLabel={this.state.parameterLabels[index]}
                        width={this.props.width}
                        height={this.props.height / this.state.parameters.length}
                        handleCalloutInfo={this.handleCalloutInfo}
                        handleCalloutLeave={this.handleCalloutLeave}
                        handleScenarioHover={this.handleScenarioHighlight}
                        scale={this.props.scale}
                    />
                
                children[param] = child;
            // }
        } 
        this.setState({
            children
        })
    }

    handleCalloutInfo = (statLabel, median, tenth, ninetyith) => {
        // console.log('handleCalloutEnter rectIsHovered');
        // console.log(statLabel, median, tenth, ninetyith)
        this.setState({ statLabel, median, tenth, ninetyith, rectIsHovered: true });
    }

    handleCalloutLeave = () => {
        this.setState({ rectIsHovered: false })
    }

    handleScenarioHighlight = (scenarioIdx) => {
        console.log(scenarioIdx)
        if (scenarioIdx !== null) {
            this.setState({ hoveredScenarioIdx: scenarioIdx })
        } else {
            this.setState({ hoveredScenarioIdx: null })
        }
    }


    render() {
        // const scenarios = Object.keys(this.props.dataset);
        // console.log(scenarios)
        // console.log('props', this.props.scenarios)
        if (this.state.hoveredScenarioIdx) console.log(this.props.scenarios[this.state.hoveredScenarioIdx])
        return (
            <div>
                <div className="scenario-title titleNarrow">{`${COUNTYNAMES[this.props.geoid]} - ${getReadableDate(this.props.summaryStart)} to ${getReadableDate(this.props.summaryEnd)}`}</div>
                {/* <h5>{`${getReadableDate(this.props.summaryStart)} to ${getReadableDate(this.props.summaryEnd)}`}</h5> */}
                <div className="row resetRow chart-callout" style={{ display: 'block !important'}}>
                    {this.state.rectIsHovered &&
                        // <Fragment>
                        //     <div className="col-2">
                        //     {/* {scenarios[this.state.hoveredScenarioIdx].replace('_',' ')} */}
                        //     </div>
                        //     <div className="col-10" >
                                
                                <SummaryLabel 
                                    classProps={'filter-label threshold-label callout'}
                                    summaryStart={this.props.summaryStart}
                                    summaryEnd={this.props.summaryEnd}
                                    scenario={this.props.scenarios[this.state.hoveredScenarioIdx].replace('_',' ')}
                                    label={this.state.statLabel.toLowerCase()}
                                    median={this.state.median}
                                    tenth={this.state.tenth}
                                    ninetyith={this.state.ninetyith}
                                />
                        //     </div>
                        // </Fragment>
                    }
                </div>
                <div className="row resetRow">
                    <div className="col-7"></div>
                    <div className="col-5 chart-legend">
                    {
                        this.props.scenarios.map( (scenario, index) => {
                            return (
                                <div key={`chart-item-${scenario}`} className="chart-item">
                                    <div
                                        key={`legend-box-${scenario}`}
                                        className='legend-box'
                                        style={ {background: scenarioColors[index], 
                                                border: 'solid',
                                                borderColor: this.state.hoveredScenarioIdx === index ? blue : scenarioColors[index],
                                                width: '12px', 
                                                height: '12px', 
                                                marginRight: '5px'}}
                                    ></div>
                                    <div
                                        key={`legend-label-${scenario}`}
                                        className="titleNarrow"
                                    >{scenario.replace('_',' ')} </div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
                {this.state.parameters.map( param => {
                    return (
                        <div className="row" key={`chart-row-${this.state.children[param].key}`}>
                            <div className="chart" key={this.state.children[param].key}>
                                {this.state.children[param].chart}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ChartContainer 