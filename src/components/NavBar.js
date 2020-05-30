import React, { Component } from 'react';
import { Row, Col } from 'antd';
import logo from '../assets/logo.png'; 
import brand from '../assets/brand.png'; 
import { ReactComponent as AltLogo } from '../assets/logo-idd-jhsph.svg';
import { ReactComponent as JHLogo } from '../assets/logo-john-hopkins.svg';
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
    return (
      <div id="navbar" className="App-header">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <AltLogo height="60" throwIfNamespace={false} style={{paddingTop: '8px'}} />
            {/* <img className="logo" src={logo} alt="Logo" />  */}
          </Col>
          <Col className="gutter-row mini-search" span={1} style={{paddingTop: '4px'}}>
          <JHLogo height="65" throwIfNamespace={false} />
            {/* <img className="brand" src={brand} alt="Brand" /> */}
          </Col>
          <Col className="gutter-row nav-menu" offset={7} span={10}>
            <ul style={{ marginTop: '5px' }}>
              {this.state.links.map( (link, index) => {
                // console.log(index, 'active', this.state.active === index)
                return (
                  <li style={{ paddingRight: (index < this.state.links.length - 1) ? '10px': '0px' }}>
                    <a href={link}>
                      <MenuItem  
                        height={index === 2 ? "36" : "40"}
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

