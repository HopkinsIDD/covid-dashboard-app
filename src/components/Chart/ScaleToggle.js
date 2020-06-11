import React, { Component } from 'react';
import { Radio } from 'antd';
import { styles } from '../../utils/constants';

class ScaleToggle extends Component {
  handleChange = (e) => {
    this.props.onScaleToggle(e.target.value);
  }

  render() {
    return ( 
      <div>
        <div className="param-header">Y-AXIS SCALE</div>
        <Radio.Group
          value={this.props.scale} 
          style={styles.Selector}
          onChange={this.handleChange}>
            <Radio.Button value='linear'>Linear</Radio.Button>
            <Radio.Button value='power'>Power</Radio.Button>
        </Radio.Group>
        <div className="filter-description">
          Toggle between a linear scale or a power scale,
          which reveals more granularity at lower levels.
        </div>
      </div>
    )
  }
}

export default ScaleToggle
