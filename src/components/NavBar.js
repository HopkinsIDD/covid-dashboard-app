import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SearchBar from './Search/SearchBar';
import { styles } from '../utils/constants';
import logo from '../assets/logo.png'; 
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showMiniSearch: false,
        divHeight: 0,
        searchBar: ''
    }
  }

  componentDidMount() {
    const divHeight = document.getElementById("search-container").clientHeight;
    this.setState({divHeight});

    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.showMiniSearch !== prevState.showMiniSearch) {
      console.log('navbar component did update')
      const { showMiniSearch } = this.state;

      let searchBar = '';
      if (showMiniSearch) {
        console.log('yes show mini search')
        searchBar = (
          <SearchBar
            stat={this.props.stat}
            geoid={this.props.geoid}
            onCountySelect={this.handleCountySelect}
            style={styles.MiniSearchBar}
            size="default"
          />   
        )
      } 
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
          <Col className="gutter-row mini-search" span={14}>
            {this.state.searchBar}
          </Col>
          <Col className="gutter-row nav-menu" span={8}>
            <ul>
              <li><a href="#scenario-comparisons">Viz</a></li>
              <li><a href="#stats">Stats</a></li>
              <li><a href="#map">Map</a></li>
            </ul>
          </Col>
        </Row>
      </div>
    )
  }
}

export default NavBar;
