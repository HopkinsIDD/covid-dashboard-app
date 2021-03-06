import React, { Component } from 'react';
import { Layout } from 'antd';
import { defaultGeoid, margin, dimMultipliers } from '../utils/constants';
import { fetchDataset, fetchActuals, fetchConfig } from '../utils/fetch';
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
            mapContainerH: 0,
            fetchErrors: ''
        };
    };

    async componentDidMount() {
        window.addEventListener('resize', this.updateGraphDimensions);
        window.addEventListener('resize', this.updateMapContainerDimensions);

        this.updateGraphDimensions();
        this.updateMapContainerDimensions();

        const { geoid } = this.state;
        try {
            const dataset = await fetchDataset(geoid);
            const actuals = await fetchActuals(geoid);
            const outcomes = await fetchConfig('outcomes');
            const indicators = Object.keys(outcomes).map((obj) => outcomes[obj]);

            this.setState({dataset, actuals, indicators});
        } catch (e) {
            this.setState({fetchErrors: e.message});
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
            const dataset = await fetchDataset(geoid);
            const actuals = await fetchActuals(geoid);
            const outcomes = await fetchConfig('outcomes');
            const indicators = Object.keys(outcomes).map((obj) => outcomes[obj]);

            this.setState({ dataset, geoid, actuals, indicators });
        } catch (e) {
            this.setState({fetchErrors: e.message});
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
                    fetchErrors={this.state.fetchErrors}
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
