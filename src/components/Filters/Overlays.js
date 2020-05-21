import React, { Component } from 'react';
import { Row, Col, Switch } from 'antd';

class Overlays extends Component {

    handleConfClick = () => {
        this.props.onConfClick();
    }

    render() {
        return (    
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="conf-bounds">
                {/* <Col className="gutter-row" span={2}> */}
                    <Switch onChange={this.handleConfClick} size="small"/>
                {/* </Col>
                <Col className="gutter-row" span={12}> */}
                    <div>&nbsp;Confidence Bounds</div>
                {/* </Col> */}
            </Row>      
        )
    }
}

export default Overlays
