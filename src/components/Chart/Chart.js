import React, { Component } from 'react'; 
import { getDateIdx } from '../../utils/utils'

class Chart extends Component {
    componentDidMount() {

        const { dataset, firstDate, summaryStart, summaryEnd, severity, stat } = this.props;
        const quantileObj = {};
        
        const scenarios = Object.keys(dataset);
        const startIdx = getDateIdx(firstDate, summaryStart);
        const endIdx = getDateIdx(firstDate, summaryEnd);

        for (let scenario of scenarios) {
            quantileObj[scenario] = {};
            // every Chart has a given severity and stat passed down from ChartContainer
            // every Chart will contain all scenarios
            // startIdx and endIdx specify the time range on which we want to calc quantiles
            // every sim.vals array will be sliced on this timeRange 
            // then every day of a simulation will be summed up returning an Array of sim sums 
            // then d3.quantiles can be applied to the Array to create final desired obj
            
            const sumArray = dataset[scenario][severity][stat].sims.map(sim => 
                sim.vals.slice(startIdx, endIdx).reduce((a, b) => a + b, 0));

            // d3.quantiles(sumArray);
        }
    }

    render() {
        return (
            <div>
                <p>{this.props.stat}</p>
                <p>{this.props.severity}</p>
            </div>
        )
    }
}

export default Chart 