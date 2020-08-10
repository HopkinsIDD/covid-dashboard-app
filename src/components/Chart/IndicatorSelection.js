import React, { Component } from 'react';
import { Select } from 'antd';
import { styles } from '../../utils/constants';

class IndicatorSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicatorsForChart: [],
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const { Option } = Select;
        const { statList, indicators } = this.props;
        
        const indicatorsForChart = Array.from(indicators);
        const keys = Object.values(statList).map(indicator => indicator.key);
        
        if (statList.length >= 2) {
          indicatorsForChart.map(indicator => {
            if (keys.includes(indicator.key)) {
                return indicator.disabled = false;
            } else {
              return indicator.disabled = true;
              }
          })
        } else {
          indicatorsForChart.map(indicator => {return indicator.disabled = false})
        }

        for (let indicator of indicatorsForChart) {
            const child = {
                key: indicator.key,
                checkbox: []
            } 
            child.checkbox.push(
                <Option
                    key={indicator.key}>
                    {indicator.name}
                </Option>
            )
            children.push(child);
        }

        this.setState({
            indicatorsForChart,
            children,
        })
    }

    componentDidUpdate(prevProp) {
      if (prevProp.statList !== this.props.statList) {
          const { statList, indicators } = this.props;

          const keys = Object.values(statList).map(indicator => indicator.key);
          const indicatorsForChart = Array.from(indicators);
          
          if (statList.length >= 3) {
            indicatorsForChart.map(indicator => {
              if (keys.includes(indicator.key)) {
                  return indicator.disabled = false;
              } else {
                return indicator.disabled = true;
              }
            })
          } else {
            indicatorsForChart.map(indicator => {return indicator.disabled = false})
          }


          const children = [];
          const { Option } = Select;
  
          for (let indicator of indicatorsForChart) {
              const child = {
                  key: indicator.key,
                  checkbox: []
              } 
              child.checkbox.push(
                  <Option
                      key={indicator.key}
                      disabled={indicator.disabled}>
                      {indicator.name}
                  </Option>
              )
              children.push(child);
          }

          this.setState({
              indicatorsForChart,
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
