import React, { Component } from 'react';
import { Select } from 'antd';

class IndicatorSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statsForChart: [],
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const statsForChart = Array.from(this.props.STATS);
        console.log(statsForChart)
        const { Option } = Select;

        const keys = Object.values(this.props.statListChart).map(stat => stat.key);
        
        if (this.props.statListChart.length >= 2) {
          statsForChart.map(stat => {
            if (keys.includes(stat.key)) {
                return stat.disabled = false;
            } else {
              return stat.disabled = true;
              }
          })
        } else {
          statsForChart.map(stat => {return stat.disabled = false})
        }

        for (let stat of statsForChart) {
            const child = {
                key: stat.key,
                checkbox: []
            } 
            child.checkbox.push(
                <Option
                    key={stat.key}>
                    {stat.name}
                </Option>
            )
            children.push(child);
        }

        this.setState({
            statsForChart,
            children,
        })
    }

    componentDidUpdate(prevProp) {
      if (prevProp.STATS !== this.props.STATS ||
          prevProp.statListChart !== this.props.statListChart) {

          const { statListChart } = this.props;

          const keys = Object.values(statListChart).map(stat => stat.key);
          const statsForChart = Array.from(this.props.STATS);
          
          if (this.props.statListChart.length >= 2) {
            statsForChart.map(stat => {
              if (keys.includes(stat.key)) {
                  return stat.disabled = false;
              } else {
                return stat.disabled = true;
              }
            })
          } else {
            statsForChart.map(stat => {return stat.disabled = false})
          }

          console.log(statsForChart)

          const children = [];
          const { Option } = Select;
  
          for (let stat of statsForChart) {
              const child = {
                  key: stat.key,
                  checkbox: []
              } 
              child.checkbox.push(
                  <Option
                      key={stat.key}
                      disabled={stat.disabled}>
                      {stat.name}
                  </Option>
              )
              children.push(child);
          }
          this.setState({
              statsForChart,
              children
          })
      }
    }

    handleChange = (event) => {
        // prevent user from deselecting all scenarios
        if (event.length === 0) { return };
        this.props.onStatClickChart(event);
        
    }

    render() {
        
        // console.log(this.props.view, defaultScenario)
        console.log(this.props.statListChart)
        return (
            <div>
                <div className="param-header">INDICATORS</div>
                <Select
                    mode="multiple"
                    style={{ width: '80%' }}
                    defaultValue={this.props.statListChart.map(s => s.key)}
                    maxTagTextLength={12}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.checkbox)}
                </Select>
            </div>
        )
    }
}

export default IndicatorSelection
