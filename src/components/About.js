import React, { Component } from 'react';
import { Layout, Col } from 'antd';
import { styles } from '../utils/constants';

class About extends Component {
  
    render() {
        const { Content } = Layout;
        return (
            <Content id="about" style={styles.ContainerGray}>
                <Col className="gutter-row container" span={16}>
                    <div className="content-section">
                        <div className="content-header">About</div>
                        <br />
                        <div style={{ textAlign: 'left' }}>                    
                            If you encounter any issues, please file them on the&nbsp;
                            <a className="customLink"
                                href="https://github.com/HopkinsIDD/covid-dashboard-app">
                                github repo
                            </a>
                        </div>
                    </div>
                </Col>
            </Content>
        )
    }
}

export default About;