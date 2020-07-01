import React, { Component } from 'react';
import Map from '../Map/Map';
import { STATS } from '../../utils/constants';
import { getDateIdx, getReadableDate } from '../../utils/utils';
import { COUNTYNAMES } from '../../utils/geoids';
import { mapHighColorPalette, mapLowColorPalette } from '../../utils/colors';


class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            scaleColors: [],
            numMaps: 4 // number of individual maps to display in Map View
        }
    }
  
    componentDidMount() {
        const { geoid, scenario, firstDate, selectedDate, width, height } = this.props;
        this.initializeMaps(geoid, scenario, firstDate, selectedDate, width, height);
    }

    componentDidUpdate(prevProps) {

        if (this.props.geoid !== prevProps.geoid 
            || this.props.selectedDate !== prevProps.selectedDate
            || this.props.countyBoundaries !== prevProps.countyBoundaries
            || this.props.scenario !== prevProps.scenario
            || this.props.width !== prevProps.width 
            || this.props.height !== prevProps.height) {
                
            const { geoid, scenario, firstDate, selectedDate, width, height } = this.props;
            this.initializeMaps(geoid, scenario, firstDate, selectedDate, width, height);
        }
    }

    initializeMaps = (geoid, scenario, firstDate, selectedDate, width, height) => {
        const children = [];
        const dateIdx = getDateIdx(firstDate, selectedDate);
        const { numMaps } = this.state;

        for (let stat of STATS.slice(0, numMaps)) {
            const child = {
                key: `${stat.key}-map`,
                map: [],
            }
            child.map.push(
                <Map
                    key={`${stat.key}-map`}
                    stat={stat}
                    geoid={geoid}
                    scenario={scenario}
                    dateIdx={dateIdx}
                    countyBoundaries={this.props.countyBoundaries}
                    statsForCounty={this.props.statsForCounty}
                    width={width / 2}
                    height={height}
                    lowColor={mapLowColorPalette[stat.id]}
                    highColor={mapHighColorPalette[stat.id]}
                />
            ) 
            children.push(child);
        }
        this.setState({ children });
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