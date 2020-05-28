import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { ReactComponent as GraphLogo } from '../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../assets/chart.svg';
import { ReactComponent as MapLogo } from '../assets/globe.svg';
import { ReactComponent as MethodsLogo } from '../assets/book.svg';

class NavBar extends Component {
    render() {
        return (
          <div className="App-header">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row nav-subtitle" span={16}>
                <h2 className="titleNarrow siteTitle">COVID-19 Intervention Scenarios</h2>
              </Col>
              <Col className="gutter-row nav-menu" span={8}>
                <ul style={{ marginTop: '5px' }}>
                  <li style={{ paddingRight: '20px'}}><a href="#scenario-comparisons"><GraphLogo height="28" /></a></li>
                  <li style={{ paddingRight: '20px'}}><a href="#stats"><ChartLogo height="28"/></a></li>
                  <li style={{ paddingRight: '30px'}}><a href="#map"><MapLogo height="28"/></a></li>
                  <li style={ {paddingRight: '20px'}}><a href="#methods"><MethodsLogo height="28"/></a></li>
                </ul>
              </Col>
            </Row>
          </div>
        )
    }
}

export default NavBar;
