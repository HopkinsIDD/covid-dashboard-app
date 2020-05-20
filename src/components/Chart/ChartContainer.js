import React, { Component } from 'react';
import Chart from '../Chart/Chart';
import { scaleLinear } from 'd3-scale';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: depending on performance, may add more or less
            parameters: ['incidI', 'incidH', 'incidD'],
            // severities: ['high', 'med', 'low'],
            children: {'incidI': {}, 'incidH': {}, 'incidD': {}}
        }
    }

    componentDidMount() {
        const { children } = this.state;
            
        for (let param of this.state.parameters) {

            // for (let severity of this.state.severities) {
                const child = {
                    key: `${param}-chart`,
                    chart: {},
                    yScale: scaleLinear()
                }

                child.chart = 
                    <Chart
                        key={`${param}-chart`}
                        dataset={this.props.dataset}
                        firstDate={this.props.firstDate}
                        summaryStart={this.props.summaryStart}
                        summaryEnd={this.props.summaryEnd}
                        // severity={severity}
                        stat={param}
                        width={this.props.width}
                        height={this.props.height / this.state.parameters.length}
                    />
                
                children[param] = child;
            // }
        } 
        this.setState({
            children
        })
    }


    render() {
        return (
            <div>
                <h1>ChartContainer</h1>
                <div className="row resetRow">
                    <div className="chart" key={this.state.children['incidH'].key}>
                        {this.state.children['incidI'].chart}
                    </div>
                </div> 
                <div className="row">

                    <div className="chart" key={this.state.children['incidH'].key}>
                        {this.state.children['incidH'].chart}
                    </div>
                </div>
                <div className="row">
                    <div className="chart" key={this.state.children['incidD'].key}>
                        {this.state.children['incidD'].chart}
                    </div>
                </div>
            </div>
        )
    }
}

export default ChartContainer 