import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { ReactComponent as AltLogo } from '../assets/logo-idd-jhsph.svg';
import MenuItem from './MenuItem';
import { ReactComponent as Hamburger } from '../assets/hamburger.svg';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      links: ['#interactive-graph', '#exploration', '#geographic-map', '#methods', '#about']
    }
  }

  handleMouseClick = (index) => {
    this.setState({ active: index })
  }

  handleMenuClick = () => {
    console.log('open menu')
    const items = document.getElementsByClassName("menu-items");
    const nav = document.getElementById("nav-menu");
    const logo = document.getElementById("logo");
    
    if (!nav.className.includes('responsive')) {
      console.log('adding responsive tag to nav element')
      nav.className += " responsive";
      logo.className += " responsive";
    } else {
      console.log('removing responsive tag to nav element')
      nav.className = nav.className.replace(' responsive', '')
      logo.className = logo.className.replace(' responsive', '')
    }

    for (let item of items) {
      if (!item.className.includes('responsive')) {
        item.className += " responsive";
      } else {
        item.className = item.className.replace(' responsive', '')
      }
    }
  }

  render() {
    return (
      <div id="navbar" className="App-header">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col id="logo" className="gutter-row logo">
            <AltLogo height="60" throwifnamespace="false" style={{paddingTop: '8px'}} />
          </Col>

          <Col id="hamburger" className="gutter-row">
            <Hamburger 
              onClick={() => this.handleMenuClick()} />
          </Col>

          <Col id="nav-menu" className="gutter-row nav-menu">
            <ul style={{ marginTop: '5px' }}>
              {this.state.links.map( (link, index) => {
                /* noun project svgs (index 3 and 4) use clip paths that require 
                different styling of fill rather than stroke */
                const activeClass = index === 3 || index === 4 ? "nav-active-methods" : "nav-active";
                const hoverClass = index === 3 || index === 4 ? "nav-hover-methods" : "nav-hover";
                return (
                  <li key={link} className="menu-items">
                    <a href={link}>
                      <MenuItem  
                        height={index === 2 ? "36" : "40"}
                        active={this.state.active === index ? true : false}
                        activeClass={activeClass}
                        hoverClass={hoverClass}
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

