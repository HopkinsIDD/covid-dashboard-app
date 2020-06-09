import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { styles } from '../utils/constants';

class Footer extends Component {
  
    render() {
        return (
          <div id="footer" className="App-header">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '10px'}}>
            <Col className="gutter-row" span={6}>
              <div className="footer">Copyright © 2020 IDD Group</div>
            </Col>
            <Col className="gutter-row" offset={7} span={10}>
            </Col>
          </Row>
        </div>
        )
    }
}

export default Footer;