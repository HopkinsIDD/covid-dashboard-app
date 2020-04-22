import React, { Component } from 'react'

class Graph extends Component {
    render() {
        return (
            <div className="graph border">
                <p>GeoID: {this.props.geoid}</p>
                <p>Stat: {this.props.stat}</p>
                <p>Scenario: {this.props.scenario}</p>
                <p>Severity: {this.props.severity}</p>
                <p>r0: {this.props.r0}</p>
                <p>Number of Simulations: {this.props.simNum}</p>
                <p>Confidence: {this.props.showConfBounds}</p>
                <p>Actual: {this.props.showActual}</p>
            </div>
        )
    }
}

export default Graph