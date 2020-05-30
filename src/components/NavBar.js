import React, { Component } from 'react';
import { Row, Col } from 'antd';
import logo from '../assets/logo.png'; 
import brand from '../assets/brand.png'; 
import { ReactComponent as GraphLogo } from '../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../assets/chart.svg';
import { ReactComponent as MapLogo } from '../assets/globe.svg';
import { ReactComponent as MethodsLogo } from '../assets/book.svg';
// import { ReactComponent as JHLogo } from '../assets/logo-john-hopkins.svg';
class NavBar extends Component {

  render() {
    return (
      <div id="navbar" className="App-header">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={1}>
            <img className="logo" src={logo} alt="Logo" /> 
          </Col>
          <Col className="gutter-row mini-search" span={6}>
            <img className="brand" src={brand} alt="Brand" />
            {/* <JHLogo height="24" throwIfNamespace={false} /> */}
          </Col>
          <Col className="gutter-row nav-menu" offset={7} span={10}>
            <ul style={{ marginTop: '5px' }}>
              <li style={{ paddingRight: '10px'}}>
                <a href="#scenario-comparisons"><GraphLogo height="24" /></a>
              </li>
              <li style={{ paddingRight: '10px'}}>
                <a href="#stats"><ChartLogo height="24"/></a>
              </li>
              <li style={{ paddingRight: '20px'}}>
                <a href="#map"><MapLogo height="24"/></a>
              </li>
              <li>
                <a href="#methods"><MethodsLogo height="24"/></a>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    )
  }
}

export default NavBar;
