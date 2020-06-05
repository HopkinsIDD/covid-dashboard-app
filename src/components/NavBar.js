import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { ReactComponent as AltLogo } from '../assets/logo-idd-jhsph.svg';
import MenuItem from './MenuItem';
import { styles } from '../utils/constants';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      links: ['#interactive-graph', '#exploration', '#geographic-map', '#methods']
    }
  }

  handleMouseClick = (index) => {
    this.setState({ active: index })
  }

  render() {
    return (
      <div id="navbar" className="App-header">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <AltLogo height="60" throwifnamespace="false" style={{paddingTop: '8px'}} />
          </Col>
          <Col className="gutter-row nav-menu" offset={7} span={10}>
            <ul style={{ marginTop: '5px' }}>
              {this.state.links.map( (link, index) => {
                return (
                  <li key={link} style={styles.Menu}>
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

