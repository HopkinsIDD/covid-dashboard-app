import React, { Component, Fragment } from 'react';
import { Layout, Row, Col } from 'antd';
import ChartContainer from './ChartContainer';
import Scenarios from '../Filters/Scenarios';
import DatePicker from './DatePicker';
import ScaleToggle from './ScaleToggle';
import IndicatorSelection from './IndicatorSelection';
import { margin, COUNTYNAMES } from '../../utils/constants';

class MainChart extends Component {
    render() {
        const { Content } = Layout;
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="stats" style={{ background: '#fefefe', padding: '50px 0' }}>
                <div className="content-section">
                    <div className="content-header">{countyName}</div>
                </div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>

                        {this.props.dataLoaded &&
                        <div className="map-container">
                            <ChartContainer
                                geoid={this.props.geoid}
                                width={this.props.graphW - margin.left - margin.right}
                                height={this.props.graphH * 1.15} 
                                dataset={this.props.dataset}
                                scenarios={this.props.scenarioListChart}
                                stats={this.props.statListChart}
                                firstDate={this.props.firstDate}
                                summaryStart={this.props.summaryStart}
                                summaryEnd={this.props.summaryEnd}
                                scale={this.props.summaryScale}
                                datePickerActive={this.props.datePickerActiveChart}
                            />
                        </div>
                        }
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <Fragment>
                            {this.props.dataLoaded &&
                            <Fragment>
                                <Scenarios 
                                    view="chart"
                                    SCENARIOS={this.props.SCENARIOS}
                                    scenario={this.props.scenario}
                                    scenarioList={this.props.scenarioListChart}
                                    onScenarioClickChart={this.handleScenarioClickChart}
                                />
                                <IndicatorSelection
                                    statListChart={this.props.statListChart}
                                    onStatClickChart={this.handleStatClickChart}
                                />
                            </Fragment>
                            }
                            <DatePicker 
                                firstDate={this.props.firstDate}
                                summaryStart={this.props.summaryStart}
                                summaryEnd={this.props.summaryEnd}
                                onHandleSummaryDates={this.handleSummaryDates}
                                onHandleDatePicker={this.handleDatePicker}
                            />
                            <ScaleToggle
                                scale={this.props.summaryScale}
                                onScaleToggle={this.handleScaleToggle}
                            />
                        </Fragment>
                    </Col>
                </Row>
            </Content>
        )
    }
}

export default MainChart;