import React, { Component } from 'react';
import Chart from '../Chart/Chart';
import { scaleLinear } from 'd3-scale';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: depending on performance, may add more or less
            parameters: ['incidI', 'incidH', 'incidD'],
            parameterLabels: ['Infections', 'Hospitalizations', 'Deaths'],
            // severities: ['high', 'med', 'low'],
            children: {'incidI': {}, 'incidH': {}, 'incidD': {}},
        }
    }

    componentDidMount() {
        this.drawSummaryStatCharts();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.summaryStart !== this.props.summaryStart || prevProps.summaryEnd !== this.props.summaryEnd) {
            console.log('ComponentDidUpdate Summary Start or End')
            this.drawSummaryStatCharts();
        }
    }

    drawSummaryStatCharts = () => {
        const { children } = this.state;
        const { summaryStart, summaryEnd } = this.props;
            
        for (let [index, param] of this.state.parameters.entries()) {

            // for (let severity of this.state.severities) {
                const child = {
                    key: `${param}-chart`,
                    chart: {},
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
                        statLabel={this.state.parameterLabels[index]}
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