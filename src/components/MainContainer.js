import React, { Component } from 'react';
import { Layout } from 'antd';
import { margin } from '../utils/constants';

import Search from './Search/Search'
import MainGraph from './Graph/MainGraph';
import MainChart from './Chart/MainChart';
import MainMap from './Map/MainMap';
import Methodology from './Methodology';

const dataset = require('../store/geo06085.json');


class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false, // TODO: might not need this here!
            geoid: '06085', 
            graphW: 0,
            graphH: 0,
            mapContainerW: 0,
            mapContainerH: 0
        };
    };

    componentDidMount() {
        // console.log('componentDidMount')
        console.log('dataset', dataset)
        
        // TODO: shift to Children or keep in MainContainer?
        window.addEventListener('resize', this.updateGraphDimensions)
        window.addEventListener('resize', this.updateMapContainerDimensions)
        this.updateGraphDimensions()
        this.updateMapContainerDimensions()
        
        // const [SCENARIOS, scenario, scenarioList, scenarioListChart, scenarioMap] =
        //     instantiateScenarios(dataset);

        // // instantiate initial series and dates
        // const { severity, stat } = this.state;
        // const series = dataset[scenario.key][severity.key][stat.key].sims;
         
        // const dates = dataset[scenario.key].dates.map( d => parseDate(d));
        // const firstDate = dates[0];
        // const lastDate = dates[dates.length - 1];
        
        // const seriesPeaks = series.map(sim => sim.max);
        // const [seriesMin, seriesMax] = getRange(seriesPeaks);
        // const statThreshold = Math.ceil((seriesMax / 1.4) / 100) * 100;

        // // iterate through SeriesList
        // const simsOver = this.updateThresholdIterate(
        //     series,
        //     statThreshold,
        //     dates,
        //     this.state.dateThreshold
        //     )        
        // const percExceedence = simsOver / series.length;

        // // send these sims to brush after it's been colored
        // // include in SeriesList loop
        // // if (firstIndex of SeriesList)
        // const allTimeSeries = Array.from(series)
        // // shouldn't happen twice
        // const allTimeDates = Array.from(dates)

        // // take out of loop so not redundant
        // const idxMin = timeDay.count(firstDate, this.state.dateRange[0]);
        // const idxMax = timeDay.count(firstDate, this.state.dateRange[1]);
        // const newDates = Array.from(allTimeDates.slice(idxMin, idxMax));
        // const filteredSeries = series.map( s => {
        //     const newS = {...s}
        //     newS.vals = s.vals.slice(idxMin, idxMax)
        //     return newS
        // })
        
        // const yAxisLabel = `Daily ${stat.name}`;
        // const percExceedenceList = [percExceedence]

        // // instantiate confidence bounds
        // const confBounds = dataset[scenario.key][severity.key][stat.key].conf;
        // const filteredConfBounds = confBounds.slice(idxMin, idxMax)

        // // instantiate start and end date (past 2 weeks) for summary stats
        // const summaryStart = new Date();
        // summaryStart.setDate(summaryStart.getDate() - 14); 

        // // add scenario to severity list
        // const sevList = _.cloneDeep(this.state.severityList);
        // sevList[0].scenario = scenario.key;

        this.setState({
            dataset
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    };

    // componentDidUpdate(prevProp, prevState) {
    //     if (this.state.dataset !== prevState.dataset) {

    //         const filteredSeriesList = []
    //         const percExceedenceList = []
    //         const confBoundsList = [];
    //         let brushSeries
            
    //         const { dataset, stat, severityList, scenarioList, r0 } = this.state;
    //         // filter series and dates by dateRange
    //         const idxMin = timeDay.count(this.state.firstDate, this.state.dateRange[0]);
    //         const idxMax = timeDay.count(this.state.firstDate, this.state.dateRange[1]);
    //         const filteredDates = Array.from(this.state.allTimeDates.slice(idxMin, idxMax));
    //         const dateThresholdIdx = Math.ceil(filteredDates.length / 2)
    //         const dateThreshold = filteredDates[dateThresholdIdx]
    //         let statThreshold = 0
    //         let sliderMin = 100000000000
    //         let sliderMax = 0

    //         for (let i = 0; i < scenarioList.length; i++) {
    //             const copy = Array.from(
    //                 dataset[scenarioList[i].key][severityList[i].key][stat.key].sims
    //                 );

    //             // filter down sims on reproductive number
    //             const newSeries = copy.filter(s => {
    //                 return (s.r0 > r0[0] && s.r0 < r0[1])
    //             });
                    
    //             const filteredSeriesForStatThreshold = newSeries.map( s => {
    //                 const newS = {...s}
    //                 newS.vals = s.vals.slice(idxMin, idxMax)
    //                 return newS
    //             });

    //             const seriesPeaks = filteredSeriesForStatThreshold.map(sim => sim.max);
    //             const [seriesMin, seriesMax] = getRange(seriesPeaks);
    //             if (seriesMin < sliderMin) sliderMin = seriesMin
    //             if (seriesMax > sliderMax) sliderMax = seriesMax
    //             // update dateThreshold before updating statThreshold?
    //             if (i === 0) statThreshold = Math.ceil(seriesMax / 1.2);

    //             const simsOver = this.updateThresholdIterate(
    //                 newSeries,
    //                 statThreshold,
    //                 this.state.allTimeDates,
    //                 dateThreshold
    //             )
    //             if (i === 0) brushSeries = newSeries

    //             const percExceedence = simsOver / newSeries.length;
    //             percExceedenceList.push(percExceedence)

    //             const filteredSeries = newSeries.map( s => {
    //                 const newS = {...s}
    //                 newS.vals = s.vals.slice(idxMin, idxMax)
    //                 return newS
    //             })
    //             filteredSeriesList.push(filteredSeries)
                
    //             // build confidence bounds list
    //             const confBounds = dataset[scenarioList[i].key][severityList[i].key][stat.key].conf;

    //             // make sure the stat has confidence bounds array
    //             if (confBounds && confBounds.length > 0) {
    //                 // filter by date range selected
    //                 const filteredConfBounds = confBounds.slice(idxMin, idxMax)
    //                 confBoundsList.push(filteredConfBounds);
    //             }
    //         }
    //         this.setState({
    //             seriesList: filteredSeriesList,
    //             allTimeSeries: brushSeries,
    //             dates: filteredDates,
    //             statThreshold,
    //             dateThreshold,
    //             seriesMin: sliderMin,
    //             seriesMax: sliderMax,
    //             percExceedenceList,
    //             confBoundsList
    //         })
    //     }
    // };

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

    // initializeGeoid(geoid, dataset) {
    //     // const [SCENARIOS, scenario, scenarioList, scenarioListChart, scenarioMap] =
    //     //     instantiateScenarios(dataset);

    //     // re-initialize severity
    //     // const severityList = [_.cloneDeep(LEVELS[0])];
    //     // severityList[0].scenario = scenario.key;

    //     // re-initialize countyBoundaries
    //     // const state = geoid.slice(0, 2);
    //     // const countyBoundaries = require('../store/countyBoundaries.json')[state];
    //     // const statsForCounty = geojsonStats[state];

    //     this.setState({
    //         dataset,
    //         geoid,
    //         SCENARIOS,
    //         scenarioList,
    //         scenarioListChart,
    //         scenarioMap,
    //         severityList,
    //         countyBoundaries,
    //         statsForCounty,
    //         r0: [0, 4]
    //     })
    // }

    handleCountySelect = (i) => {
        const dataset = require(`../store/geo${i.geoid}.json`);
        // this.initializeGeoid(i.geoid, dataset);

        this.setState({
            dataset,
            geoid: i.geoid
        })
    };
    
    handleUpload = (dataset, geoid) => {
        // this.initializeGeoid(geoid, dataset);
        this.setState({
            dataset,
            geoid
        })
    };

    render() {
        return (
            <Layout>
                {/* Search Component */}
                <Search
                    geoid={this.state.geoid}
                    stat={this.state.stat} // TODO: do you need this?
                    onFileUpload={this.handleUpload}
                    onCountySelect={this.handleCountySelect}>
                </Search>

                {/* MainGraph Component */}
                {this.state.dataLoaded &&
                <MainGraph 
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.graphW}
                    height={this.state.graphH}
                />}

                {/* MainChart Component */}
                {this.state.dataLoaded &&
                <MainChart 
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.graphW - margin.left - margin.right}
                    height={this.state.graphH * 1.15} 
                />}

                {/* MainMap Component */}
                {this.state.dataLoaded &&
                <MainMap
                    geoid={this.state.geoid}
                    dataset={this.state.dataset}
                    width={this.state.mapContainerW - margin.left - margin.right}
                    height={this.state.mapContainerH}
                />}
                
                {/* Methodology Component */}
                <Methodology />

            </Layout>
        )
    }
}

export default MainContainer;
