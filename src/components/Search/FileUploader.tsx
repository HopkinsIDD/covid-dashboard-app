import React, { Component } from 'react';
import { Col, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { GeoId } from "../../utils/constantsTypes";
import { RcFile } from "antd/lib/upload";


interface Props {
    onUpload: (json: JSON, geoId: GeoId) => void,
}

class FileUploader extends Component<Props> {

    beforeUpload = (file: RcFile) => {
        const reader = new FileReader();
        if (this.validateSize(file)) {
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    const json = JSON.parse(reader.result);
                    const geoid = file.name.replace('.json', '');

                    if (this.validateFile(json)) {
                        this.props.onUpload(json, geoid);
                    }
                }

            };
            reader.readAsText(file);

            // Prevent upload
            return false;
        }
    };

    validateFile = (json: JSON) => {
        console.log(`validateFile(): ${json})`);
        return true;
    };

    validateSize = (file: RcFile) => {
        const mbMaxSize = 1024 * 1024 * 100;  //100mb
        if (file.size > mbMaxSize) {
            alert(`File is too large, please upload a file less than ${mbMaxSize}`);
            return false;
        } else {
            return true;
        }
    };

    render() {
        return (
            <Col className="gutter-row" span={6}>
                <Upload
                    accept=".json"
                    // @ts-ignore beforeUpload needs to return false to prevent upload
                    beforeUpload={this.beforeUpload}>
                    <Button>
                        <UploadOutlined/> Click to Upload
                    </Button>
                </Upload>
            </Col>
        )
    }
}

export default FileUploader;
