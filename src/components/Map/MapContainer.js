import React, { Component } from 'react';
import Map from '../Map/Map';
import { getDateIdx } from '../../utils/utils';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            parameters: ['incidI', 'incidH', 'incidD'],
            parameterLabels: ['Infections', 'Hospitalizations', 'Deaths']
        }
    }
  
    componentDidMount() {
        // TODO: which scenario to display? default is first scenario (preprocessed)
        const children = [];
        const dateIdx = getDateIdx(this.props.firstDate, this.props.dateThreshold);

        for (let [index, param] of this.state.parameters.entries()) {
            const child = {
                'key': `${param}-map`,
                'map': [],
            }
            child.map.push(
                <Map
                    key={`${param}-map`}
                    stat={param}
                    statLabel={this.state.parameterLabels[index]}
                    dateIdx={dateIdx}
                    countyBoundaries={this.props.countyBoundaries}
                    statsForCounty={this.props.statsForCounty}
                    width={this.props.width / this.state.parameters.length}
                    height={this.props.height}
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
            || this.props.dateThreshold !== prevProps.dateThreshold) {

            const children = [];
            const dateIdx = getDateIdx(this.props.firstDate, this.props.dateThreshold);

            for (let [index, param] of this.state.parameters.entries()) {
                const child = {
                    'key': `${param}-map`,
                    'map': [],
                }
                child.map.push(
                    <Map
                        key={`${param}-map`}
                        stat={param}
                        statLabel={this.state.parameterLabels[index]}
                        dateIdx={dateIdx}
                        countyBoundaries={this.props.countyBoundaries}
                        statsForCounty={this.props.statsForCounty}
                        width={this.props.width / this.state.parameters.length}
                        height={this.props.height}
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
                <h1>MapContainer</h1>
                <div className="row">
                    {this.state.children.map(child => {
                        return (
                            <div className="col map" key={child.key}>
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