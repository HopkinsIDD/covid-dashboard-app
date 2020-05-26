import React, { Component } from 'react';
import Map from '../Map/Map';
import { getDateIdx, getReadableDate } from '../../utils/utils';
import { COUNTYNAMES, mapLowColors, mapHighColors, graphBkgd } from '../../utils/constants';

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
        // TODO: which scenario to display? default is first scenario (preprocessed)
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
                    lowColor={mapLowColors[index]}
                    highColor={mapHighColors[index]}
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
                        lowColor={mapLowColors[index]}
                        highColor={mapHighColors[index]}
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
        return (
            <div>
                <div className="scenario-title titleNarrow">{COUNTYNAMES[this.props.geoid]}</div>
                <div className="filter-label threshold-label callout callout-row">{`Date of State-wide Summary: `}<span className="bold">{getReadableDate(this.props.selectedDate)}</span></div>
                <div className="map-wrapper">
                    {this.state.children.map(child => {
                        return (
                            <div className="map" key={child.key} style={{ background: graphBkgd }}>
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