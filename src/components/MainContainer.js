import React, { Component } from 'react';
import { Layout } from 'antd';
import { margin } from '../utils/constants';

import Search from './Search/Search'
import MainGraph from './Graph/MainGraph';
import MainChart from './Chart/MainChart';
import MainMap from './Map/MainMap';
import Methodology from './Methodology';

const dataset = require('../store/geo36005.json');


class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false, 
            geoid: '36005', 
            graphW: 0,
            graphH: 0,
            mapContainerW: 0,
            mapContainerH: 0
        };
    };

    componentDidMount() {
        // console.log('componentDidMount')
        console.log('dataset', dataset)
        
        window.addEventListener('resize', this.updateGraphDimensions);
        window.addEventListener('resize', this.updateMapContainerDimensions);

        this.updateGraphDimensions();
        this.updateMapContainerDimensions();
        
        this.setState({dataset}, () => {
            this.setState({dataLoaded: true});
        })
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGraphDimensions)
        window.removeEventListener('resize', this.updateMapContainerDimensions)
    }

    updateGraphDimensions = () => {
        const graphW = (window.innerWidth * 0.6585) - margin.yAxis; // this.graphEl.clientWidth - margin.yAxis;
        const graphH = window.innerHeight * 0.53;
        this.setState({ graphW, graphH, animateTransition: false });
      }

    updateMapContainerDimensions = () => {
        const mapContainerW = ((window.innerWidth * 0.6585) - margin.yAxis) - ( 3 * (margin.left)) - (3 * (margin.right));
        const mapContainerH = window.innerHeight * 0.35;
        this.setState({ mapContainerW, mapContainerH });
    }

    handleCountySelect = (i) => {
        const dataset = require(`../store/geo${i.geoid}.json`);
        this.setState({dataset, geoid: i.geoid})
    };
    
    handleUpload = (dataset, geoid) => {
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
                    height={this.state.graphH * 1.15} 
                />}

                {this.state.dataLoaded &&
                <MainMap
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.mapContainerW - margin.left - margin.right}
                    height={this.state.mapContainerH}
                />}
                
                <Methodology />

            </Layout>
        )
    }
}

export default MainContainer;
