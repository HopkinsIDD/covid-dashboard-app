import React, { Component } from 'react';
import Map from '../Map/Map';
import { getDateIdx, getReadableDate, formatTitle } from '../../utils/utils';
import { GEOIDS } from '../../utils/geoids.tsx';
import { mapHighColorPalette, mapLowColorPalette } from '../../utils/colors';
import { scalePow } from 'd3-scale';
import { select } from 'd3-selection';


class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            scaleColors: [],
            strokeWidth: 0.8,
            strokeHoverWidth: 1.8
        }
        this.mapRefContainer = React.createRef();

        this.strokeWidthScale = scalePow().exponent(0.25)
            .range([0.1, 0.8]).domain([9, 1])
        this.strokeHoverWidthScale = scalePow().exponent(0.25)
            .range([0.25, 1.8]).domain([9, 1])
    }

    componentDidMount() {
        const { geoid, scenario, firstDate, selectedDate, width, height } = this.props;
        this.initializeMaps(geoid, scenario, firstDate, selectedDate, width, height);
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.geoid !== prevProps.geoid
            || this.props.selectedDate !== prevProps.selectedDate
            || this.props.countyBoundaries !== prevProps.countyBoundaries
            || this.props.scenario !== prevProps.scenario
            || this.props.width !== prevProps.width
            || this.props.height !== prevProps.height
            || this.state.strokeWidth !== prevState.strokeWidth) {

            const { geoid, scenario, firstDate, selectedDate, width, height } = this.props;
            this.initializeMaps(geoid, scenario, firstDate, selectedDate, width, height);
        }
    }

    initializeMaps = (geoid, scenario, firstDate, selectedDate, width, height) => {
        const children = [];
        const { indicators } = this.props;
        const { strokeWidth, strokeHoverWidth } = this.state;
        const dateIdx = getDateIdx(firstDate, selectedDate);
        let divider;
        if (width < 350) {
            divider = 1
        } else if (width >= 350 && width < 700) {
            divider = 2
        } else {
            divider = 3
        }

        for (let indicator of indicators) {
            const child = {
                key: `${indicator.key}-map`,
                map: [],
            }
            child.map.push(
                <Map
                    key={`${indicator.key}-map`}
                    indicator={indicator}
                    geoid={geoid}
                    scenario={scenario}
                    dateIdx={dateIdx}
                    countyBoundaries={this.props.countyBoundaries}
                    indicatorsForCounty={this.props.indicatorsForCounty}
                    width={width / divider}
                    height={height}
                    lowColor={mapLowColorPalette[indicator.id]}
                    highColor={mapHighColorPalette[indicator.id]}
                    strokeWidth={strokeWidth}
                    strokeHoverWidth={strokeHoverWidth}
                    handleZoom={this.handleZoom}
                />
            )
            children.push(child);
        }
        this.setState({ children });
    }

    handleZoom = (event) => {
        if (this.mapRefContainer.current) {
            const mapNode = select(this.mapRefContainer.current)
            mapNode.selectAll('path')
                .attr('transform', event.transform)
            const strokeWidth = this.strokeWidthScale(event.transform.k)
            const strokeHoverWidth = this.strokeHoverWidthScale(event.transform.k)
            this.setState({ strokeWidth, strokeHoverWidth })
        }
    }

    render() {
        const { geoid, scenario } = this.props;
        const scenarioTitle = formatTitle(scenario);
        const geoidName = `${GEOIDS[geoid]}`;
        return (
            <div>
                <div className="scenario-title titleNarrow">{geoidName}</div>
                <div className="scenario-title">{scenarioTitle}</div>
                <div className="filter-label threshold-label callout callout-row">
                    {`Snapshot on `}
                    {/*TS migration: Use getClassForActiveState(this.props.dateSliderActive)*/}
                    <span className={this.props.dateSliderActive ? 'underline-active' : 'bold underline'}>
                        {getReadableDate(this.props.selectedDate)}
                    </span>
                </div>
                <div className="map-wrapper" ref={this.mapRefContainer}>
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
