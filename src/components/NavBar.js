import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SearchBar from './Search/SearchBar';
import { styles, COUNTYNAMES } from '../utils/constants';
import logo from '../assets/logo.png'; 
import brand from '../assets/idd.png'; 
import { ReactComponent as GraphLogo } from '../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../assets/chart.svg';
import { ReactComponent as MapLogo } from '../assets/globe.svg';
import { ReactComponent as MethodsLogo } from '../assets/book.svg';
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showMiniSearch: false,
        divHeight: 0,
        searchBar: '',
        countyName: ''
    }
  }

  componentDidMount() {
    const divHeight = document.getElementById("search-container").clientHeight;
    const searchBar = <img className="brand" src={brand} alt="Brand" />;
    const countyName = COUNTYNAMES[this.props.geoid];

    this.setState({
      divHeight, 
      searchBar, 
      countyName
    });

    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.showMiniSearch !== prevState.showMiniSearch ||
        this.props.geoid !== prevProps.geoid) {

      const { showMiniSearch } = this.state;
      const countyName = COUNTYNAMES[this.props.geoid];

      let searchBar = '';
      // if (showMiniSearch) {
      //   console.log('yes show mini search')
      //   searchBar = (
      //     <SearchBar
      //       stat={this.props.stat}
      //       geoid={this.props.geoid}
      //       onCountySelect={this.handleCountySelect}
      //       style={styles.MiniSearchBar}
      //       size="default"
      //     />   

      //   )
      // } 
      console.log('set state')
      this.setState({searchBar});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    const { divHeight } = this.state;
    const scroll = event.target.scrollTop;

    if (scroll > divHeight) {
      this.setState({showMiniSearch: true});
    } else {
      this.setState({showMiniSearch: false});
    }
  }

  handleCountySelect = (i) => {
    this.props.onCountySelect(i);
  }

  render() {
    return (
      <div id="navbar" className="App-header">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={1}>
            <img className="logo" src={logo} alt="Logo" /> 
          </Col>
          <Col className="gutter-row mini-search" span={12}>
            {this.state.searchBar}
          </Col>
          <Col className="gutter-row nav-menu" span={10}>
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
