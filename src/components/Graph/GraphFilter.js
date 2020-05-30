import React, { Component, Fragment } from 'react';
import Scenarios from '../Filters/Scenarios';
import Indicators from '../Filters/Indicators';
import Switch from '../Filters/Switch';
import R0 from '../Filters/R0';
import SeverityContainer from '../Filters/SeverityContainer'
import Sliders from '../Filters/Sliders';


class GraphFilter extends Component {
    handleScenarioClick = (i) => {
        this.props.onScenarioClickGraph(i);
    }

    handleButtonClick = (i) => {
        this.props.onButtonClick(i);
    }
    
    handleConfClick = () => {
        this.props.onConfClick();
    }

    handleSeveritiesClick = (i) => {
        this.props.onSeveritiesClick(i);
    }

    handleSeveritiesHover = (i) => {
        this.props.onSeveritiesHover(i);
    }

    handleSeveritiesHoverLeave= () => {
        this.props.onSeveritiesHoverLeave();
    }

    handleR0Change= (e) => {
        this.props.onHandleR0Change(e);
    }

    handleStatSliderChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateSliderChange = (i) => {
        this.props.onDateSliderChange(i);
    }

    render() {
        return (
            <Fragment>
                <Scenarios
                    view="graph"
                    SCENARIOS={this.props.SCENARIOS}
                    scenario={this.props.scenario}
                    scenarioList={this.props.scenarioList}
                    onScenarioClick={this.handleScenarioClick}
                />
                <Indicators
                    stat={this.props.stat}
                    onButtonClick={this.handleButtonClick}
                />        
                <Switch 
                    onConfClick={this.handleConfClick}
                /> 
                <R0
                    r0={this.props.r0}
                    onR0Change={this.handleR0Change}
                />
                <SeverityContainer
                    stat={this.props.stat}
                    severityList={this.props.severityList}
                    scenarioList={this.props.scenarioList}
                    onSeveritiesClick={this.handleSeveritiesClick}
                    onSeveritiesHover={this.handleSeveritiesHover}
                    onSeveritiesHoverLeave={this.handleSeveritiesHoverLeave}
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
                    onStatSliderChange={this.handleStatSliderChange}
                    onDateSliderChange={this.handleDateSliderChange}
                    onSliderMouseEvent={this.props.onSliderMouseEvent}
                />
            </Fragment>   
        )
    }
}

export default GraphFilter;
