import React, { Component } from 'react';
import { Row, Switch } from 'antd';

class Overlays extends Component {

    handleConfClick = () => {
        this.props.onConfClick();
    }

    render() {
        return (    
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="conf-bounds">
                <Switch onChange={this.handleConfClick} size="small"/>
                <div>&nbsp;Confidence Bounds</div>
            </Row>      
        )
    }
}

export default Overlays
