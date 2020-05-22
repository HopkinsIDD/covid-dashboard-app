import React, { Component, Fragment } from 'react';
import Chart from '../Chart/Chart';
import SummaryLabel from '../Chart/SummaryLabel';
// import { scaleLinear } from 'd3-scale';
import { COUNTYNAMES, scenarioColors, blue } from '../../utils/constants'
import { timeFormat } from 'd3-time-format';

const getReadableDate = timeFormat('%b %d, %Y');

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: depending on performance, may add more or less
            parameters: ['incidI', 'incidH', 'incidD'],
            parameterLabels: ['Infections', 'Hospitalizations', 'Deaths'],
            // severities: ['high', 'med', 'low'],
            children: {'incidI': {}, 'incidH': {}, 'incidD': {}},
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
            || prevProps.scale !== this.props.scale) {
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
                        scenarios={Object.keys(this.props.dataset)}
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
        const scenarios = Object.keys(this.props.dataset);
        return (
            <div>
                <h2>{`${COUNTYNAMES[this.props.geoid]} Summary Statistics`}</h2>
                <h5>{`${getReadableDate(this.props.summaryStart)} to ${getReadableDate(this.props.summaryEnd)}`}</h5>
                <div className="row resetRow chart-callout">
                    {this.state.rectIsHovered &&
                    <SummaryLabel 
                        classProps={'filter-label threshold-label callout'}
                        summaryStart={this.props.summaryStart}
                        summaryEnd={this.props.summaryEnd}
                        label={this.state.statLabel.toLowerCase()}
                        median={this.state.median}
                        tenth={this.state.tenth}
                        ninetyith={this.state.ninetyith}
                    />
                    }
                </div>
                <div className="row resetRow">
                    <div className="col-7"></div>
                    <div className="col-5 chart-legend">
                    {
                        scenarios.map( (scenario, index) => {
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
                <div className="row resetRow">
                    <div className="chart" key={this.state.children['incidH'].key}>
                        {this.state.children['incidI'].chart}
                    </div>
                </div> 
                <div className="row">

                    <div className="chart" key={this.state.children['incidH'].key}>
                        {this.state.children['incidH'].chart}
                    </div>
                </div>
                <div className="row">
                    <div className="chart" key={this.state.children['incidD'].key}>
                        {this.state.children['incidD'].chart}
                    </div>
                </div>
            </div>
        )
    }
}

export default ChartContainer 