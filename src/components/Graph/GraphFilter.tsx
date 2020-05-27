import React, { Component } from 'react';
import Legend from '../Graph/Legend';
import Scenarios from '../Filters/Scenarios';
import Indicators from '../Filters/Indicators.tsx';
import Overlays from '../Filters/Overlays';
import R0 from '../Filters/R0';
import SeverityContainer from '../Filters/SeverityContainer'
import Sliders from '../Filters/Sliders';

interface Props {
    onScenarioClickGraph: (any) => void; //FIXME any should be typed
    onButtonClick: (any) => void; //FIXME any should be typed
    onSeveritiesClick: (any) => void; //FIXME any should be typed
    onSeveritiesHover: (any) => void; //FIXME any should be typed
    onHandleR0Change: (any) => void; //FIXME any should be typed
    onStatSliderChange: (any) => void; //FIXME any should be typed
    onDateSliderChange: (any) => void; //FIXME any should be typed
    onConfClick: () => void;
    onSeveritiesHoverLeave: () => void;
    SCENARIOS: Array<Scenario>;
    scenario: Scenario;
}

class GraphFilter extends Component<Props> {

    render() {
        return (
            <div>
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
                <Overlays 
                    showConfBounds={this.props.showConfBounds}
                    onConfClick={this.props.onConfClick}
                /> 
                <R0
                    r0={this.props.r0}
                    onR0Change={this.props.onHandleR0Change}
                />
                <SeverityContainer
                    stat={this.props.stat}
                    severityList={this.props.severityList}
                    scenarioList={this.props.scenarioList}
                    onSeveritiesClick={this.props.onSeveritiesClick}
                    onSeveritiesHover={this.props.onSeveritiesHover}
                    onSeveritiesHoverLeave={this.props.onSeveritiesHoverLeave}
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
            </div>   
        )
    }
}

export default GraphFilter;
