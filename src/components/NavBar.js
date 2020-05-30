import React, { Component } from 'react';
import { Row, Col } from 'antd';
import logo from '../assets/logo.png'; 
import brand from '../assets/idd.png'; 
import { ReactComponent as GraphLogo } from '../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../assets/chart.svg';
import { ReactComponent as MapLogo } from '../assets/globe.svg';
import { ReactComponent as MethodsLogo } from '../assets/book.svg';
import { select } from 'd3-selection';
// import { ReactComponent as JHLogo } from '../assets/logo-john-hopkins.svg';
import { green } from '../utils/constants.js'
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      logos: [<GraphLogo 
        height="24" 
        className="nav-hover"
        onClick={() => this.handleMouseClick}
        />, <ChartLogo 
        height="24"
        className="nav-hover"
        onClick={() => this.handleMouseClick}
        />, <MapLogo 
        height="24"
        className="nav-hover"
        onClick={() => this.handleMouseClick}
      />, <MethodsLogo
        height="24"
        className="nav-hover-methods"
        onClick={() => this.handleMouseClick}
      /> 
      ],
      links: ['#scenario-comparisons', '#stats', '#map', '#methods']
    }
  }

  handleMouseClick = (menuItem) => {
    console.log('clicked')
    console.log(menuItem)
    this.setState({ active: menuItem })
    // select(event.target).attr("class", "nav-active")
  }

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
              {this.state.logos.map( (logo, index) => {
                return (
                  <li style={{ paddingRight: (index < this.state.logos.length - 1) ? '10px': '0px' }}>
                    <a href={this.state.links[index]}>
                      {logo}
                    </a>
                  </li>
                )
              })}
            </ul>
          </Col>
        </Row>
      </div>
    )
  }
}

export default NavBar;
