import React, { PureComponent } from 'react';
import { Radio } from 'antd';
// import { styles } from '../../utils/constants';

class Switch extends PureComponent {
    render() {
        const value = this.props.showConfBounds ? "confidence" : "exceedence";
        return (    
            <Radio.Group
                value={value}
                style={{ width: '80%', marginTop: '5%' }}
                onChange={this.props.onConfClick}>
                <Radio.Button
                    key="exceedence" 
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                    value="exceedence">
                    Exceedence
                </Radio.Button>
                <Radio.Button
                    key="confidence"
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                    value="confidence">
                    Confidence
                </Radio.Button>
            </Radio.Group> 
        )
    }
}

export default Switch
