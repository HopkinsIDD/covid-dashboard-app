import React, { Component } from 'react';
import { ReactComponent as GraphLogo } from '../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../assets/chart.svg';
import { ReactComponent as MapLogo } from '../assets/globe.svg';
import { ReactComponent as MethodsLogo } from '../assets/book.svg';
import { ReactComponent as AboutLogo } from '../assets/info.svg';
import { styles } from '../utils/constants';

class MenuItem extends Component {

  handleClickEvent = (menuItem) => {
    this.props.handleMouseClick(menuItem)
  }


  render() {
      const { menuItem, height, active, activeClass, hoverClass } = this.props;
    
      if (menuItem === 0) {
        return( <GraphLogo 
          height={height}
          style={styles.Menu}
          className={active ? activeClass : hoverClass}
          onClick={() => this.handleClickEvent(menuItem)}
        />
        )
      }
      if (menuItem === 1) {
        return( <ChartLogo 
          height={height}
          style={styles.Menu}
          className={active ? activeClass : hoverClass}
          onClick={() => this.handleClickEvent(menuItem)}
        />
        )
      }
      if (menuItem === 2) {
        return( <MapLogo 
          height={height}
          style={styles.MenuMap}
          className={active ? activeClass : hoverClass}
          onClick={() => this.handleClickEvent(menuItem)}
        />
        )
      }
      if (menuItem === 3) {
        return( <MethodsLogo 
          height={height}
          style={styles.Menu}
          className={active ? activeClass : hoverClass}
          onClick={() => this.handleClickEvent(menuItem)}
        />
        )
      }
      if (menuItem === 4) {
        return( <AboutLogo 
          height={height}
          style={styles.Menu}
          className={active ? activeClass : hoverClass}
          onClick={() => this.handleClickEvent(menuItem)}
        />
        )
      }
  }
}

export default MenuItem;