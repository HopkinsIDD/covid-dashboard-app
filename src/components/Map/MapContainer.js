import React, { Component } from 'react';
import Map from '../Map/Map';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
        }
    }
  
    componentDidMount() {
        // TODO: which scenario to display?
        console.log('arrayI')
    }

    componentDidUpdate(prevProps, prevState) {
        // TODO: scenarioList may not be in here - depends on behavior we want
        // for which scenario to plot
        if (this.props.dataset !== prevProps.dataset ||
            this.props.scenarioList !== prevProps.scenarioList) {
            console.log('')
        }
    }


    render() {
        // const { scenarioList } = this.props
        // const scenario = scenarioList.length > 0 ? scenarioList[0] : scenarioList
        return (
            <div>
                <h1>MapContainer</h1>
                <div className="map">
                    <Map
                        stat="incidI"
                        dateThreshold={this.props.dateThreshold}
                        countyBoundaries={this.props.countyBoundaries}
                        statsForCounty={this.props.statsForCounty}
                    />
                </div>
            </div>
        )
    }
}

export default MapContainer