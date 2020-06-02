import React, { Component, Fragment } from 'react';
import { Layout, Row, Col } from 'antd';
import ChartContainer from './ChartContainer';
import Scenarios from '../Filters/Scenarios';
import DatePicker from './DatePicker';
import ScaleToggle from './ScaleToggle';
import IndicatorSelection from './IndicatorSelection';
import { styles, COUNTYNAMES } from '../../utils/constants';

class MainChart extends Component {
    
    render() {
        const { Content } = Layout;
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <Content id="stats" style={styles.ContainerWhite}>
                <div className="content-section">
                    <div className="content-header">{countyName}</div>
                </div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <div className="map-container">
                            <ChartContainer
                                geoid={this.props.geoid}
                                width={this.props.width}
                                height={this.props.height} 
                                dataset={this.props.dataset}
                                scenarios={this.props.scenarioList}
                                stats={this.props.stats}
                                firstDate={this.props.firstDate}
                                summaryStart={this.props.summaryStart}
                                summaryEnd={this.props.summaryEnd}
                                scale={this.props.scale}
                                datePickerActive={this.props.datePickerActiveChart}
                            />
                        </div>
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <Fragment>
                            <Fragment>
                                <Scenarios 
                                    view="chart"
                                    SCENARIOS={this.props.SCENARIOS}
                                    scenario={this.props.scenario}
                                    scenarioList={this.props.scenarioListChart}
                                    onScenarioClickChart={this.props.onScenarioClickChart}
                                />
                                <IndicatorSelection
                                    statListChart={this.props.stats}
                                    onStatClickChart={this.props.onStatClickChart}
                                />
                            </Fragment>
                            <DatePicker 
                                firstDate={this.props.firstDate}
                                summaryStart={this.props.summaryStart}
                                summaryEnd={this.props.summaryEnd}
                                onHandleSummaryDates={this.props.onHandleSummaryDates}
                                onHandleDatePicker={this.props.onHandleDatePicker}
                            />
                            <ScaleToggle
                                scale={this.props.scale}
                                onScaleToggle={this.props.onHandleScaleToggle}
                            />
                        </Fragment>
                    </Col>
                </Row>
            </Content>
        )
    }
}

export default MainChart;