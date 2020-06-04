import React, { Component } from 'react';
import { Slider } from 'antd';
import { styles } from '../../utils/constants';


class R0 extends Component {

    handleChange = (e) => {
        // prevent user from selecting no range
        if (e[1] - e[0] < 1) {return;}
        this.props.onR0Change(e);
    }

    render() {
        const { r0 } = this.props;
        return (
            <div>
                <div className="param-header">
                    REPRODUCTIVE NUMBER 
                    <span className="tooltip"> &#9432;</span>
                </div>
                <div className="filter-label">
                    <span className='callout'>R<sub>0</sub> between {r0[0]} - {r0[1]}</span>
                </div>
                <Slider
                    style={{ width: '80%' }}
                    range
                    marks={styles.MarksR0}
                    min={0}
                    max={4} 
                    step={0.5}
                    included={true}
                    tooltipVisible={false}
                    defaultValue={r0}
                    value={r0}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default R0
