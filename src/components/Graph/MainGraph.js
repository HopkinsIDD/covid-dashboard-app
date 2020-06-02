import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import GraphContainer from './GraphContainer';
import GraphFilter from './GraphFilter';
import Brush from '../Filters/Brush';
import { styles, margin, COUNTYNAMES } from '../../utils/constants';

class MainGraph extends Component {
    render() {
        const { Content } = Layout;
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="scenario-comparisons" style={styles.ContainerGray}>
                <div className="content-section">
                    <div className="content-header">{countyName}</div>
                </div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <GraphContainer 
                            stat={this.props.stat}
                            geoid={this.props.geoid}
                            yAxisLabel={this.props.yAxisLabel}
                            scenarioList={this.props.scenarioList}
                            severity={this.props.severity}
                            r0={this.props.r0}
                            animateTransition={this.props.animateTransition}
                            toggleAnimateTransition={this.props.toggleAnimateTransition}
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
                            width={this.props.width}
                            height={this.props.height}
                            scenarioClickCounter={this.props.scenarioClickCounter}
                            scenarioHovered={this.props.scenarioHovered}
                            statSliderActive={this.props.statSliderActive}
                            dateSliderActive={this.props.dateSliderActive}
                        /> 
                        <Brush
                            series={this.props.allTimeSeries}
                            dates={this.props.allTimeDates}
                            width={this.props.width}
                            height={80}
                            x={margin.yAxis}
                            y={0}
                            animateTransition={this.props.animateTransition}
                            toggleAnimateTransition={this.props.toggleAnimateTransition}
                            dateRange={this.props.dateRange}
                            dateThreshold={this.props.dateThreshold}
                            statThreshold={this.props.statThreshold}
                            onBrushChange={this.props.onBrushChange}
                            onBrushStart={this.props.onBrushStart}
                            onBrushEnd={this.props.onBrushEnd}
                        />
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <GraphFilter
                            SCENARIOS={this.props.SCENARIOS}
                            scenario={this.props.scenario}
                            scenarioList={this.props.scenarioList}
                            onScenarioClickGraph={this.props.onScenarioClickGraph}
                            stat={this.props.stat}
                            onButtonClick={this.props.onButtonClick}
                            onConfClick={this.props.onConfClick}
                            severityList={this.props.severityList}
                            onSeveritiesClick={this.props.onSeveritiesClick}
                            onSeveritiesHover={this.props.onSeveritiesHover}
                            onSeveritiesHoverLeave={this.props.onSeveritiesHoverLeave}
                            dates={this.props.dates}
                            r0={this.props.r0}
                            onHandleR0Change={this.props.onHandleR0Change}
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
                    </Col>
                </Row>
            </Content>
        )
    }
}

export default MainGraph;