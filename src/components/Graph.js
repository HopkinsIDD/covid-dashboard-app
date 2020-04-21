import React, { Component } from 'react'

class Graph extends Component {
    // TODO: state.scenario removal shouldn be reflected in Graph Component
    render() {
        return (
            <div className="graph border">
                <p>Graph</p>
                <p>GeoID: {this.props.geoid}</p>
                <p>Stat: {this.props.stat}</p>
                <p>Scenario: {this.props.scenario}</p>
            </div>
        )
    }
}

export default Graph