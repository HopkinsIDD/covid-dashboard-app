import React, { Component } from 'react';
import { Row, Switch as AntSwitch } from 'antd';
import { styles } from '../../utils/constants';

class Switch extends Component {

    handleChange = () => {
        this.props.onConfClick()
    }

    render() {
        return (    
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={styles.Switch}>
                <AntSwitch
                    style={{ 'marginTop': '1%' }}
                    onChange={this.handleChange}
                    size="small"/>
                <div>&nbsp;Confidence Bounds</div>
            </Row>      
        )
    }
}

export default Switch
