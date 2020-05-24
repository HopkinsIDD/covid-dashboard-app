import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import ChartContainer from './ChartContainer';
import DatePicker from './DatePicker';

class GraphFilter extends Component {
    handleSummaryStart = (i) => {
        this.props.onHandleSummaryStart(i);
    }

    handleSummaryEnd = (i) => {
        this.props.onHandleSummaryEnd(i);
    }

    render() {
        const { Content } = Layout;
        return (
            <Content style={{ background: 'white', padding: '50px 0' }}>
                <div className="content-section">
                    <div className="content-header">Summary Across Scenarios</div>
                </div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row container" span={16}>
                        <div className="map-container">
                            <ChartContainer
                                width={this.props.width}
                                height={this.props.graphH}
                                dataset={this.props.dataset}
                                firstDate={this.props.firstDate}
                                summaryStart={this.props.summaryStart}
                                summaryEnd={this.props.summaryEnd}
                            />
                        </div>
                    </Col>

                    <Col className="gutter-row filters" span={6}>
                        <DatePicker 
                            firstDate={this.props.firstDate}
                            summaryStart={this.props.summaryStart}
                            summaryEnd={this.props.summaryEnd}
                            onHandleSummaryStart={this.handleSummaryStart}
                            onHandleSummaryEnd={this.handleSummaryEnd}
                        />
                    </Col>
                </Row>
            </Content>
        )
    }
}

export default GraphFilter;
