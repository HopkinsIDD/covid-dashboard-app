import React, { Component, Fragment } from 'react';
import { Layout, Row, Col } from 'antd';
import MapContainer from './MapContainer';
import Scenarios from '../Filters/Scenarios';
import DateSlider from './DateSlider';
import { margin, COUNTYNAMES } from '../../utils/constants';

class MainMap extends Component {
  render() {
    const { Content } = Layout;
    const countyName = `${COUNTYNAMES[this.props.geoid]}`;
    return (
      <Content id="map" style={{ padding: '50px 0' }}>
          <div className="content-section">
              <div className="content-header">{countyName}</div>
          </div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row container" span={16} style={{ paddingLeft: margin.yAxis + (2 * margin.left) + margin.right }}>
                  <div className="map-container">
                      <MapContainer
                          width={this.props.width}
                          height={this.props.height}
                          scenario={this.props.scenario}
                          geoid={this.props.geoid}
                          firstDate={this.props.firstDate}
                          selectedDate={this.props.selectedDate}
                          countyBoundaries={this.props.countyBoundaries}
                          statsForCounty={this.props.statsForCounty}
                          dateSliderActive={this.props.dateSliderActive}
                      />
                  </div>
              </Col>

              <Col className="gutter-row filters" span={6}>
                  <Fragment>
                      <Scenarios
                          view="map"
                          // temporary fix for different scenario array lengths between dataset and map
                          SCENARIOS={this.props.SCENARIOS}
                          scenario={this.props.scenario}
                          onScenarioClickMap={this.props.onScenarioClickMap}
                      />
                      <DateSlider
                          dates={this.props.dates}
                          endIndex={this.props.endIndex}
                          currentDateIndex={this.props.currentDateIndex}
                          selectedDate={this.props.selectedDate}
                          onMapSliderChange={this.props.onMapSliderChange}
                          onSliderMouseEvent={this.props.onSliderMouseEvent}
                      />
                  </Fragment>
              </Col>
          </Row>
      </Content>
    )
  }

}

export default MainMap