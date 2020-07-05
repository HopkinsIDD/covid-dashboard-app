import React, { Component } from 'react';
import { Layout } from 'antd';
import { margin, dimMultipliers } from '../utils/constants';

import Search from './Search/Search'
import MainGraph from './Graph/MainGraph';
import MainChart from './Chart/MainChart';
import MainMap from './Map/MainMap';
import Methodology from './Methodology';
import About from './About';

const dataset = require('../store/geo06085.json');


class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false, 
            geoid: '06085', 
            graphW: 0,
            graphH: 0,
            mapContainerW: 0,
            mapContainerH: 0
        };
    };

    componentDidMount() {
        // console.log('MainContainer componentDidMount')
        window.addEventListener('resize', this.updateGraphDimensions);
        window.addEventListener('resize', this.updateMapContainerDimensions);

        this.updateGraphDimensions();
        this.updateMapContainerDimensions();
        
        console.log('dataset', dataset)
        this.setState({dataset}, () => {
            this.setState({dataLoaded: true});
        })
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGraphDimensions)
        window.removeEventListener('resize', this.updateMapContainerDimensions)
    }

    updateGraphDimensions = () => {
        const ratioH = dimMultipliers.graphDesktopH;
        const ratioW = window.innerWidth > 800 ? dimMultipliers.graphDesktopW : dimMultipliers.graphMobileW; // account for mobile

        const graphH = window.innerHeight * ratioH;
        const graphW = (window.innerWidth * ratioW) - margin.yAxis; 

        this.setState({ graphW, graphH, animateTransition: false });
      }

    updateMapContainerDimensions = () => {
        const ratioH = dimMultipliers.mapDesktopH;
        const ratioW = window.innerWidth > 800 ? dimMultipliers.graphDesktopW : dimMultipliers.mapMobileW; // account for mobile 

        const mapContainerH = window.innerHeight * ratioH;
        const mapContainerW = ((window.innerWidth * ratioW) - margin.yAxis) - (6 * (margin.left))
        
        this.setState({ mapContainerW, mapContainerH });
    }

    handleCountySelect = (i) => {
        const dataset = require(`../store/geo${i.geoid}.json`);
        this.setState({dataset, geoid: i.geoid})
    };
    
    handleUpload = (dataset, geoid) => {
        console.log('Main handleUpload', geoid, dataset)
        this.setState({dataset, geoid})
    };

    render() {
        return (
            <Layout>
                <Search
                    geoid={this.state.geoid}
                    onFileUpload={this.handleUpload}
                    onCountySelect={this.handleCountySelect}>
                </Search>

                {this.state.dataLoaded &&
                <MainGraph 
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.graphW}
                    height={this.state.graphH}
                />}

                {this.state.dataLoaded &&
                <MainChart 
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.graphW - margin.left - margin.right}
                    height={this.state.graphH * dimMultipliers.chartDesktopH} 
                />}

                {this.state.dataLoaded &&
                <MainMap
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.mapContainerW - margin.left - margin.right}
                    height={this.state.mapContainerH}
                />}
                
                <Methodology />
                <About />
            </Layout>
        )
    }
}

export default MainContainer;
