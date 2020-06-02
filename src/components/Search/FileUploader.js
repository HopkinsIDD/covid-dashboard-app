import React, { Component } from 'react';
import { Col, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


class FileUploader extends Component {

    beforeUpload = file => {
        const reader = new FileReader();
        if (this.validateSize(file)) {
            reader.onload = () => {
                const json = JSON.parse(reader.result);
                const geoid = file.name.replace('geo','').replace('.json','');

                if (this.validateFile(json)) {
                    this.props.onUpload(json, geoid);
                }
            };
            reader.readAsText(file);

            // Prevent upload
            return false;
        }
    }

    validateFile = (json) => {
        // TODO: validation step
        console.log(json)
    }

    validateSize = (file) => {
        const mbMaxSize = 1024 * 1024 * 100;  //100mb
        let error = '';
        if (file.size > mbMaxSize) {
            error = `File is too large, please upload a file less than ${mbMaxSize}`;
            alert(error);
        } else {
            return true;
        }
    }

    render() {
        return (
            <Col className="gutter-row" span={6}> 
                <Upload 
                    accept=".json"
                    beforeUpload={file => this.beforeUpload(file)}>
                    <Button>
                        <UploadOutlined /> Click to Upload
                    </Button>

                </Upload> 
            </Col> 
        )
    }
}

export default FileUploader;
