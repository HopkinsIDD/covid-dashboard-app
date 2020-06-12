import React, { Component } from 'react';
import Map from '../Map/Map';
import { getDateIdx, getReadableDate } from '../../utils/utils';
import { COUNTYNAMES } from '../../utils/constants';
import { mapHighColorPalette, mapLowColorPalette } from '../../utils/colors';

// const lowColors = ['#deebf7', '#e5f5e0', '#fee6ce'] 
// const highColors = ['#3885fa', '#008769', '#e6550d']

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            parameters: ['incidI', 'incidH', 'incidICU', 'incidD'],
            parameterLabels: ['Infections', 'Hospitalizations', 'ICU Cases', 'Deaths'],
            scaleColors: []
        }
    }
  
    componentDidMount() {
        const children = [];
        const dateIdx = getDateIdx(this.props.firstDate, this.props.selectedDate);

        for (let [index, param] of this.state.parameters.entries()) {
            const child = {
                key: `${param}-map`,
                map: [],
            }
            child.map.push(
                <Map
                    key={`${param}-map`}
                    stat={param}
                    statLabel={this.state.parameterLabels[index]}
                    geoid={this.props.geoid}
                    scenario={this.props.scenario}
                    dateIdx={dateIdx}
                    countyBoundaries={this.props.countyBoundaries}
                    statsForCounty={this.props.statsForCounty}
                    width={this.props.width / 2}
                    height={this.props.height}
                    lowColor={mapLowColorPalette[index]}
                    highColor={mapHighColorPalette[index]}
                />
            ) 
            children.push(child);
        }

        this.setState({
            children
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.geoid !== prevProps.geoid 
            || this.props.selectedDate !== prevProps.selectedDate
            || this.props.countyBoundaries !== prevProps.countyBoundaries
            || this.props.scenario !== prevProps.scenario
            || this.props.width !== prevProps.width 
            || this.props.height !== prevProps.height) {

            const children = [];
            const dateIdx = getDateIdx(this.props.firstDate, this.props.selectedDate);

            for (let [index, param] of this.state.parameters.entries()) {
                const child = {
                    key: `${param}-map`,
                    map: [],
                }
                child.map.push(
                    <Map
                        key={`${param}-map`}
                        stat={param}
                        statLabel={this.state.parameterLabels[index]}
                        geoid={this.props.geoid}
                        scenario={this.props.scenario}
                        dateIdx={dateIdx}
                        countyBoundaries={this.props.countyBoundaries}
                        statsForCounty={this.props.statsForCounty}
                        width={this.props.width / 2}
                        height={this.props.height}
                        lowColor={mapLowColorPalette[index]}
                        highColor={mapHighColorPalette[index]}
                    />
                ) 
                children.push(child);
            }
    
            this.setState({
                children
            })   
        }
    }


    render() {
        // const { scenarioList } = this.props
        // const scenario = scenarioList.length > 0 ? scenarioList[0] : scenarioList
        const scenarioTitle = this.props.scenario.replace('_', ' ')
        const countyName = `${COUNTYNAMES[this.props.geoid]}`;
        return (
            <div>
                <div className="scenario-title titleNarrow">{countyName}</div> 
                <div className="scenario-title">{scenarioTitle}</div>
                <div className="filter-label threshold-label callout callout-row">
                    {`Snapshot on `}
                    <span className={this.props.dateSliderActive ? 'underline-active' : 'bold underline'}>
                        {getReadableDate(this.props.selectedDate)}
                    </span>
                </div>
                <div className="map-wrapper">
                    {this.state.children.map(child => {
                        return (
                            <div className="map" key={child.key}>
                                {child.map}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default MapContainer