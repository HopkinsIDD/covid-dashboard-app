import React, { Component } from 'react';
import { Switch } from 'antd';

class Overlays extends Component {

    handleConfClick = () => {
        this.props.onConfClick();
    }

    render() {
        return (    
            <div className="row conf-bounds">
                <Switch onChange={this.handleConfClick} size="small"/>
                <div>&nbsp;Confidence Bounds</div>
            </div>      
        )
    }
}

export default Overlays
