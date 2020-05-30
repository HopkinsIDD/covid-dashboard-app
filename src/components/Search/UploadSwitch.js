import React, { Component } from 'react';
import { Row, Switch } from 'antd';
import { styles } from '../../utils/constants';

class UploadSwitch extends Component {

    handleChange = () => {
        this.props.onUploadToggle()
    }

    render() {
        const { showFileUpload } = this.props;
        return (    
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={styles.UploadSwitch}>
                <Switch
                    style={{ 'marginTop': '0.1rem' }}
                    onChange={this.handleChange}
                    size="small"/>
                <div className="upload-toggle">
                    {showFileUpload ? 
                        "Upload File provided by the Johns Hopkins IDD Working Group, for example, geo06085.json" : 
                        "Upload File"}
                </div>
            </Row>      
        )
    }
}

export default UploadSwitch
