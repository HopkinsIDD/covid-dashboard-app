import React, { Component } from 'react';
import Chart from '../Chart/Chart';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: depending on performance, may add more or less
            severities: ['high', 'med', 'low'],
            parameters: ['incidI', 'incidH', 'incidD'],
            children: {'incidI': [], 'incidH': [], 'incidD': []}
        }
    }

    componentDidMount() {
        const { children } = this.state;

        for (let severity of this.state.severities) {
            
            for (let param of this.state.parameters) {
                const child = {
                    key: `${param}-${severity}-chart`,
                    chart: [],
                }

                child.chart.push(
                    <Chart
                        key={`${param}-${severity}-chart`}
                        dataset={this.props.dataset}
                        firstDate={this.props.firstDate}
                        summaryStart={this.props.summaryStart}
                        summaryEnd={this.props.summaryEnd}
                        severity={severity}
                        stat={param}
                    />
                ) 
                children[param].push(child);
            }
        } 
        this.setState({
            children
        })
    }


    render() {
        return (
            <div>
                <h1>ChartContainer</h1>
                <div className="row">
                    {this.state.children['incidI'].map(child => {
                        return (
                            <div className="col chart" key={child.key}>
                                {child.chart}
                            </div>
                        )
                    })}
                </div> 
                <div className="row">
                    {this.state.children['incidH'].map(child => {
                        return (
                            <div className="col chart" key={child.key}>
                                {child.chart}
                            </div>
                        )
                    })}
                </div>
                <div className="row">
                    {this.state.children['incidD'].map(child => {
                        return (
                            <div className="col chart" key={child.key}>
                                {child.chart}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default ChartContainer 