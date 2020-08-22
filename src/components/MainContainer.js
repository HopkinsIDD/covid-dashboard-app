import React, { Component } from 'react';
import { Layout } from 'antd';
import { defaultGeoid, margin, dimMultipliers } from '../utils/constants';
import { fetchJSON } from '../utils/fetch';
import { USE_LOCAL_OUTCOMES_FILE, LOCAL_OUTCOMES_FILE, USE_LOCAL_GEOID_FILE, 
    LOCAL_GEOID_FILE, USE_LOCAL_ACTUAL_FILE, LOCAL_ACTUAL_FILE } from '../store/config.tsx';
import Search from './Search/Search.tsx'
import MainGraph from './Graph/MainGraph';
import MainChart from './Chart/MainChart';
import MainMap from './Map/MainMap';
import Methodology from './Methodology';
import About from './About';


class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false, 
            geoid: defaultGeoid, 
            indicators: [],
            actuals: {},
            graphW: 0,
            graphH: 0,
            mapContainerW: 0,
            mapContainerH: 0
        };
    };

    // async get(fileType, useLocal, localFile) {
    //     let dataset;
    //     if (useLocal) {
    //         dataset = require(`../store/${localFile}`);
    //     } else {
    //         dataset = await fetchJSON(fileType);
    //     }
    //     return dataset;
    // }

    async componentDidMount() {
        window.addEventListener('resize', this.updateGraphDimensions);
        window.addEventListener('resize', this.updateMapContainerDimensions);

        this.updateGraphDimensions();
        this.updateMapContainerDimensions();

        const { geoid } = this.state;
        try {
            // const dataset = this.get(geoid, USE_LOCAL_GEOID_FILE, LOCAL_GEOID_FILE);
            // const actuals = this.get(`${geoid}_actuals`, USE_LOCAL_ACTUAL_FILE, LOCAL_ACTUAL_FILE) 
            // const outcomes = this.get('outcomes', USE_LOCAL_OUTCOMES_FILE, LOCAL_OUTCOMES_FILE) 
            // const indicators = Object.keys(outcomes).map((obj) => outcomes[obj]);

            // dataset fetch
            let dataset;
            if (USE_LOCAL_GEOID_FILE) {
                dataset = require(`../store/${LOCAL_GEOID_FILE}`);
            } else {
                dataset = await fetchJSON(geoid);
            }

            // actuals fetch
            let actuals;
            if (USE_LOCAL_ACTUAL_FILE) {
                actuals = require(`../store/${LOCAL_ACTUAL_FILE}`);
            } else {
                actuals = await fetchJSON(`${geoid}_actuals`);
            }
            
            // outcomes fetch
            let outcomes;
            if (USE_LOCAL_OUTCOMES_FILE) {
                outcomes = require(`../store/${LOCAL_OUTCOMES_FILE}`);
            } else {
                outcomes = await fetchJSON('outcomes');
            }
            const indicators = Object.keys(outcomes).map((obj) => outcomes[obj]);

            this.setState({dataset, actuals, indicators});
        } catch (e) {
            console.log('Fetch was problematic: ' + e.message)
        } finally {
            this.setState({dataLoaded: true});
        }
    };
   
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGraphDimensions)
        window.removeEventListener('resize', this.updateMapContainerDimensions)
    }

    updateGraphDimensions = () => {
        const ratioH = dimMultipliers.graphDesktopH;
        const ratioW = window.innerWidth > 800 ?
            dimMultipliers.graphDesktopW :
            dimMultipliers.graphMobileW; // account for mobile

        const graphH = window.innerHeight * ratioH;
        const graphW = (window.innerWidth * ratioW) - margin.yAxis;

        this.setState({ graphW, graphH, animateTransition: false });
    }

    updateMapContainerDimensions = () => {
        const ratioH = dimMultipliers.mapDesktopH;
        const ratioW = window.innerWidth > 800 ?
            dimMultipliers.graphDesktopW :
            dimMultipliers.mapMobileW; // account for mobile 

        const mapContainerH = window.innerHeight * ratioH;
        const mapContainerW = ((window.innerWidth * ratioW) - margin.yAxis) -
            (6 * (margin.left));

        this.setState({ mapContainerW, mapContainerH });
    }

    handleCountySelect = async (geoid) => {
        try {
            const dataset = await fetchJSON(geoid);
            const actuals = await fetchJSON(`${geoid}_actuals`);

            this.setState({ dataset, geoid, actuals });
        } catch (e) {
            console.log('Fetch was problematic: ' + e.message)
        }
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
                    indicators={this.state.indicators}
                    actuals={this.state.actuals}
                    width={this.state.graphW}
                    height={this.state.graphH}
                />}

                {this.state.dataLoaded &&
                <MainChart
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    indicators={this.state.indicators}
                    width={this.state.graphW - margin.left - margin.right}
                    height={this.state.graphH * dimMultipliers.chartDesktopH}
                />}

                {this.state.dataLoaded &&
                <MainMap
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    indicators={this.state.indicators}
                    width={this.state.mapContainerW - margin.left - margin.right}
                    height={this.state.mapContainerH}
                />}

                <Methodology/>
                <About/>
            </Layout>
        )
    }
}

export default MainContainer;
