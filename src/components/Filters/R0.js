import React, { Component } from 'react';
import { Slider } from 'antd';

const marks = {0: '0', 1: '', 2: '', 3: '', 4: '4'};

class R0 extends Component {

    handleChange = (e) => {
        // prevent user from selecting no range
        if (e[1] - e[0] < 1) {return;}
        this.props.onR0Change(e);
    }

    render() {
        return (
            <div>
                <div className="param-header">REPRODUCTIVE NUMBER</div>
                <Slider
                    style={{ width: '70%' }}
                    range
                    marks={marks}
                    min={0}
                    max={4} 
                    step={0.5}
                    included={true}
                    tooltipVisible={false}
                    defaultValue={this.props.r0}
                    value={this.props.r0}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default R0
