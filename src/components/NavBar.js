import React, { Component } from 'react';
import { Row, Col } from 'antd';
import logo from '../assets/logo.png'; 
import brand from '../assets/brand.png'; 
import MenuItem from './MenuItem';
// import { ReactComponent as JHLogo } from '../assets/logo-john-hopkins.svg';
import { isThisTypeNode } from 'typescript';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      links: ['#scenario-comparisons', '#stats', '#map', '#methods']
    }
  }

  handleMouseClick = (index) => {
    // console.log('clicked')
    // console.log(index)
    this.setState({ active: index })
  }

  render() {
    console.log(this.state.active)
    return (
      <div id="navbar" className="App-header">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={1}>
            <img className="logo" src={logo} alt="Logo" /> 
          </Col>
          <Col className="gutter-row mini-search" span={6}>
            <img className="brand" src={brand} alt="Brand" />
          </Col>
          <Col className="gutter-row nav-menu" offset={7} span={10}>
            <ul style={{ marginTop: '5px' }}>
              {this.state.links.map( (link, index) => {
                console.log(index, 'active', this.state.active === index)
                return (
                  <li style={{ paddingRight: (index < this.state.links.length - 1) ? '10px': '0px' }}>
                    <a href={link}>
                      <MenuItem  
                        height="24"
                        active={this.state.active === index ? true : false}
                        activeClass={index === 3 ? "nav-active-methods" : "nav-active"}
                        hoverClass={index === 3 ? "nav-hover-methods" : "nav-hover"}
                        handleMouseClick={this.handleMouseClick}
                        menuItem={index}
                      />
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

