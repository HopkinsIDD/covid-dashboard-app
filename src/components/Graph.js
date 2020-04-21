import React, { Component } from 'react'
// import *.csv from '../store/geo06085.csv'; as a test dataset

class Graph extends Component {
    // TODO: state.scenario removal shouldn be reflected in Graph Component
    render() {
        return (
            <div className="graph border">
                <p>Graph</p>
                <p>GeoID: {this.props.geoid}</p>
                <p>Stat: {this.props.stat}</p>
                <p>Scenario: {this.props.scenario}</p>
                <p>Severity: {this.props.severity}</p>
            </div>
        )
    }
}

export default Graph