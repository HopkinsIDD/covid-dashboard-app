import React, { Component, Fragment } from 'react';
import Scenarios from '../Filters/Scenarios';
import Indicators from '../Filters/Indicators';
import Switch from '../Filters/Switch';
import R0 from '../Filters/R0';
import SeverityContainer from '../Filters/SeverityContainer'
import Sliders from '../Filters/Sliders';


class GraphFilter extends Component {
    render() {
        return (
            <Fragment>
                <Scenarios
                    view="graph"
                    SCENARIOS={this.props.SCENARIOS}
                    scenario={this.props.scenario}
                    scenarioList={this.props.scenarioList}
                    onScenarioClick={this.props.onScenarioClickGraph}
                />
                <Indicators
                    stat={this.props.stat}
                    onButtonClick={this.props.onButtonClick}
                />        
                <Switch 
                    onConfClick={this.props.onConfClick}
                /> 
                <SeverityContainer
                    stat={this.props.stat}
                    severityList={this.props.severityList}
                    scenarioList={this.props.scenarioList}
                    onSeveritiesClick={this.props.onSeveritiesClick}
                    onSeveritiesHover={this.props.onSeveritiesHover}
                    onSeveritiesHoverLeave={this.props.onSeveritiesHoverLeave}
                />
                <R0
                    r0={this.props.r0}
                    onR0Change={this.props.onHandleR0Change}
                />
                <Sliders 
                    stat={this.props.stat}
                    dates={this.props.dates}
                    seriesMax={this.props.seriesMax}
                    seriesMin={this.props.seriesMin}
                    statThreshold={this.props.statThreshold}
                    dateThreshold={this.props.dateThreshold}
                    dateThresholdIdx={this.props.dateThresholdIdx}
                    firstDate={this.props.firstDate}
                    lastDate={this.props.lastDate}
                    dateRange={this.props.dateRange}
                    onStatSliderChange={this.props.onStatSliderChange}
                    onDateSliderChange={this.props.onDateSliderChange}
                    onSliderMouseEvent={this.props.onSliderMouseEvent}
                />
            </Fragment>   
        )
    }
}

export default GraphFilter;
