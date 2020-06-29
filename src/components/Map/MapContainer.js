import React, { Component } from 'react';
import Map from '../Map/Map';
import { getDateIdx, getReadableDate } from '../../utils/utils';
import { COUNTYNAMES } from '../../utils/geoids';
import { mapHighColorPalette, mapLowColorPalette } from '../../utils/colors';


class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            scaleColors: []
        }
    }
  
    componentDidMount() {
        // const children = [];
        const { stat } = this.props;
        const dateIdx = getDateIdx(this.props.firstDate, this.props.selectedDate);

        console.log('MapContainer componentDidMount')
        // for (let [index, param] of this.state.parameters.entries()) {
        const index = 0; // TODO: decide what to do about colors
        const child = {
            key: `${stat.key}-map`,
            map: [],
        }
        child.map.push(
            <Map
                key={`${stat.key}-map`}
                dataset={this.props.dataset}
                stat={stat}
                geoid={this.props.geoid}
                scenario={this.props.scenario}
                dateIdx={dateIdx}
                countyBoundaries={this.props.countyBoundaries}
                width={this.props.width / 2}
                height={this.props.height}
                lowColor={mapLowColorPalette[index]}
                highColor={mapHighColorPalette[index]}
            />
        ) 
        // children.push(child);
        // }

        this.setState({ children: [child] })
    }

    componentDidUpdate(prevProps) {

        if (this.props.geoid !== prevProps.geoid) console.log('this.props.geoid !== prevProps.geoid', this.props.geoid !== prevProps.geoid)
        if (this.props.selectedDate !== prevProps.selectedDate) console.log('this.props.selectedDate !== prevProps.selectedDate', this.props.selectedDate !== prevProps.selectedDate)
        if (this.props.countyBoundaries !== prevProps.countyBoundaries) console.log('this.props.countyBoundaries !== prevProps.countyBoundaries', this.props.countyBoundaries !== prevProps.countyBoundaries)
        if (this.props.scenario !== prevProps.scenario) console.log('this.props.scenario !== prevProps.scenario', this.props.scenario !== prevProps.scenario)
        if (this.props.width !== prevProps.width) console.log('this.props.width !== prevProps.width', this.props.width !== prevProps.width)
        if (this.props.height !== prevProps.height) console.log('this.props.height !== prevProps.height', this.props.height !== prevProps.height)

        if (
            this.props.geoid !== prevProps.geoid 
            || this.props.selectedDate !== prevProps.selectedDate
            || this.props.countyBoundaries !== prevProps.countyBoundaries
            || this.props.scenario !== prevProps.scenario
            || this.props.stat !== prevProps.stat
            || this.props.width !== prevProps.width 
            || this.props.height !== prevProps.height) {

             console.log('MapContainer componentDidUpdate')
            // const children = [];
            const { stat, firstDate, selectedDate } = this.props;

            const dateIdx = getDateIdx(firstDate, selectedDate);

            // for (let [index, param] of this.state.parameters.entries()) {
            const index = 0;
            const child = {
                key: `${stat.key}-map`,
                map: [],
            }
            child.map.push(
                <Map
                    key={`${stat.key}-map`}
                    dataset={this.props.dataset}
                    stat={stat}
                    geoid={this.props.geoid}
                    scenario={this.props.scenario}
                    dateIdx={dateIdx}
                    countyBoundaries={this.props.countyBoundaries}
                    width={this.props.width / 2}
                    height={this.props.height}
                    lowColor={mapLowColorPalette[index]}
                    highColor={mapHighColorPalette[index]}
                />
            ) 
            // children.push(child);
            // }
            this.setState({ children: [child]})   
        }
    }

    render() {
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