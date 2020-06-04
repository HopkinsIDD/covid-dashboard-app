import React, { Component } from 'react';
import { Layout, Col } from 'antd';
import { styles } from '../utils/constants';

class Methodology extends Component {
  
    render() {
        const { Content } = Layout;
        return (
            <Content id="methods" style={styles.ContainerWhite}>
                <Col className="gutter-row container" span={16}>
                    <div className="content-section">
                        <div className="content-header">Methodology</div>
                        <br />
                        <div style={{ textAlign: 'left' }}>                    
                            Prepared by the&nbsp;
                            <a className="customLink"
                                href="http://www.iddynamics.jhsph.edu/">
                                Johns Hopkins IDD
                            </a>
                            &nbsp;Working Group.
                        </div>
                    </div>
                </Col>
            </Content>
        )
    }
}

export default Methodology;
