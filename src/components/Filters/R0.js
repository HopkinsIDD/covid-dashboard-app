import React, { Component } from 'react';
import { Slider } from 'antd';

class R0 extends Component {

    handleChange = (e) => {
        // user cannot select one value as r0
        // if (e[0] === e[1]) {return;}
        this.props.onR0Change(e);
    }

    render() {
        const marks = {0: '0', 1: '', 2: '', 3: '', 4: '4'};
        return (
            <div>
                <div className="param-header">REPRODUCTIVE NUMBER</div>
                <Slider
                    style={{ width: '70%' }}
                    range
                    marks={marks}
                    min={0}
                    max={4} 
                    included={true}
                    tooltipVisible={false}
                    defaultValue={this.props.r0}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default R0
