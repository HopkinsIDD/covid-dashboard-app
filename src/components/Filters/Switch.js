import React, { PureComponent } from 'react';
import { Row, Switch as AntSwitch } from 'antd';
import { styles } from '../../utils/constants';

class Switch extends PureComponent {
    render() {
        return (    
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={styles.Switch}>
                <AntSwitch
                    style={{ 'marginTop': '1%' }}
                    checked={this.props.showConfBounds}
                    onChange={this.props.onConfClick}
                    size="small"/>
                <div>&nbsp;Confidence Bounds</div>
            </Row>      
        )
    }
}

export default Switch
