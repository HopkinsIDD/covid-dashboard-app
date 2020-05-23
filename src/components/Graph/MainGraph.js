import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import GraphContainer from './GraphContainer';
import GraphFilter from './GraphFilter';
import Brush from '../Filters/Brush';
import { margin } from '../../utils/constants';

class MainGraph extends Component {
    handleScenarioClick = (i) => {
        this.props.onScenarioClick(i);
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

    handleStatSliderChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateSliderChange = (i) => {
        this.props.onDateSliderChange(i);
    }

    render() {
        const { Content } = Layout;
        return (
            <Content style={{ padding: '50px 0' }}>
                <div className="content-section">
                    <div className="content-header">Scenario Comparisons</div>
                </div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <div
                            className="graph resetRow"
                            ref={ (graphEl) => { this.graphEl = graphEl } }
                            >
                            <div>
                                <GraphContainer 
                                    stat={this.props.stat}
                                    geoid={this.props.geoid}
                                    yAxisLabel={this.props.yAxisLabel}
                                    scenarioList={this.props.scenarioList}
                                    severity={this.props.severity}
                                    r0={this.props.r0}
                                    simNum={this.props.simNum}
                                    showConfBounds={this.props.showConfBounds}
                                    confBoundsList={this.props.confBoundsList}
                                    showActual={this.props.showActual}
                                    seriesList={this.props.seriesList}
                                    dates={this.props.dates}
                                    statThreshold={this.props.statThreshold}
                                    dateThreshold={this.props.dateThreshold}
                                    percExceedenceList={this.props.percExceedenceList}
                                    dateRange={this.props.dateRange}
                                    brushActive={this.props.brushActive}
                                    width={this.props.graphW}
                                    height={this.props.graphH}
                                    scenarioClickCounter={this.props.scenarioClickCounter}
                                    scenarioHovered={this.props.scenarioHovered}
                                /> 
                                <Brush
                                    series={this.props.allTimeSeries}
                                    dates={this.props.allTimeDates}
                                    width={this.props.graphW}
                                    height={80}
                                    x={margin.yAxis}
                                    y={0}
                                    dateRange={this.props.dateRange}
                                    dateThreshold={this.props.dateThreshold}
                                    statThreshold={this.props.statThreshold}
                                    onBrushChange={this.handleBrushRange}
                                    onBrushStart={this.handleBrushStart}
                                    onBrushEnd={this.handleBrushEnd}
                                />
                            </div>
                        </div>
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <GraphFilter
                            SCENARIOS={this.props.SCENARIOS}
                            scenario={this.props.scenario}
                            scenarioList={this.props.scenarioList}
                            onScenarioClick={this.handleScenarioClick}
                            stat={this.props.stat}
                            onButtonClick={this.handleButtonClick}
                            showConfBounds={this.props.showConfBounds}
                            onConfClick={this.handleConfClick}
                            severityList={this.props.severityList}
                            onSeveritiesClick={this.handleSeveritiesClick}
                            onSeveritiesHover={this.handleSeveritiesHover}
                            onSeveritiesHoverLeave={this.handleSeveritiesHoverLeave}
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
                            />
                    </Col>
                </Row>
            </Content>

        )
    }
}

export default MainGraph;
