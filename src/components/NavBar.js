import React, { Component } from 'react';
import { Row, Col } from 'antd';

class NavBar extends Component {
    render() {
        return (
          <div className="App-header">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row nav-subtitle" span={16}>
                <h2 className="titleNarrow siteTitle">COVID-19 Intervention Scenarios</h2>
              </Col>
              <Col className="gutter-row nav-menu" span={8}>
                <ul>
                  <li><a href="#scenario-comparisons">VIZ</a></li>
                  <li><a href="#stats">STATS</a></li>
                  <li><a href="#map">MAP</a></li>
                </ul>
              </Col>
            </Row>
          </div>
        )
    }
}

export default NavBar;
