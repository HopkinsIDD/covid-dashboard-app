import React, { Component } from 'react';
import { Select } from 'antd';
import { styles } from '../../utils/constants';
import TooltipHandler from '../Filters/TooltipHandler';

class IndicatorSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicatorsForChart: [],
            showTooltip: false,
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

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    handleChange = (event) => {
        // prevent user from deselecting all scenarios
        if (event.length === 1) { return };
        this.props.onStatClickChart(event);
    }

    render() {
        return (
            <div>
                <div className="param-header">INDICATORS
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                            Indicators are calculated after accounting for the 
                            appropriate time delays and probabilities of transitioning 
                            into a given state (e.g., initial infection to hospitalization). 
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
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
