import React, { Component } from 'react';
import { Select } from 'antd';
import { styles } from '../../utils/constants';

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
        const { statList, STATS } = this.props;
        const statsForChart = Array.from(STATS);
        const { Option } = Select;

        const keys = Object.values(statList).map(stat => stat.key);
        
        if (statList.length >= 2) {
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
      if (prevProp.statList !== this.props.statList) {
          const { statList, STATS } = this.props;

          const keys = Object.values(statList).map(stat => stat.key);
          const statsForChart = Array.from(STATS);
          
          if (statList.length >= 3) {
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
        if (event.length === 1) { return };
        this.props.onStatClickChart(event);
    }

    render() {
        return (
            <div>
                <div className="param-header">INDICATORS</div>
                <Select
                    mode="multiple"
                    style={styles.Selector}
                    defaultValue={this.props.statList.map(s => s.key)}
                    value={this.props.statList.map(s => s.key)}
                    maxTagTextLength={12}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.checkbox)}
                </Select>
            </div>
        )
    }
}

export default IndicatorSelection
