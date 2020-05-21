import React, { Component } from 'react';
import { Row, Col, Select, Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';
import { COUNTIES } from '../utils/constants.js';
import { ReactComponent as MagnifyingGlass } from '../assets/search.svg';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            countyName: '',
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const { Option } = Select;

        for (let county of COUNTIES) {
            const child = {
                key: `${county.geoid}-county`,
                button: []
            } 
            child.button.push(
                <Option
                    key={`${county.geoid}-county`}
                    value={county.geoid}>
                    {county.name}
                </Option>
            )
            children.push(child);
        }

        this.setState({children})
    }

    handleCountySelect = (event) => {

        const item = COUNTIES.filter(county => county.geoid === event)[0];

        this.props.onCountySelect(item);
        this.setState({
            countyName: `${item.name}, ${item.usps}`
        })

        // use for when files are on public internet
        // axios.get(event.path)
        //     .catch(error => {
        //         console.log('error', error);
        //     })
        //     .then(response => {
        //         // console.log('event', event)
        //         // console.log('response', response)
        //         const json = response.data;
        //         this.props.onCountySelect(json);
        //         this.setState({
        //             'countyName': event.name + ', ' + event.usps
        //         })
        //     });
    }

    handleUpload = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            if (this.validateSize(file) && this.validateType(file)) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const json = JSON.parse(fileReader.result);
                    this.props.onFileUpload(json);
                    this.setState({'fileName': file.name})
                }
                fileReader.readAsText(file)
            }
        }
    }

    validateSize = (file) => {
        let size = 100000000;  //100mb
        let error = '';
        if (file.size > size) {
            error = 'File is too large, please upload a smaller file';
            // react-toastify beautifies notifications
            alert(error);
        } else {
            return true;
        }
    }

    validateType = (file) => {
        let error = '';
        if (file.type !== 'application/json') {
            error = 'Please upload json file';
            // react-toastify beautifies notifications
            alert(error);
        } else {
            return true;
        }
    }


    render() {
        const { fileName, countyName } = this.state;
        const countyLabel = countyName === '' ? 'Search for your county' : countyName;
        const uploadLabel = fileName === '' ? 'Upload File' : fileName;
        
        return (
            <div className="dropdown">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={18}>
                        <Select
                            placeholder={countyLabel}
                            defaultValue={this.props.geoid}
                            style={{ width: 600 }}
                            size="large"
                            onChange={this.handleCountySelect}>
                            {this.state.children.map(county => county.button)}
                        </Select>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <form>
                            <div className="custom-file filter-label">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    placeholder="Upload File"
                                    id="upload"
                                    onChange={this.handleUpload}>
                                </input>
                                <label
                                    className="custom-file-label"
                                    htmlFor="upload">
                                    {uploadLabel}
                                </label>
                            </div>
                        </form>
                    </Col>
                </Row>
            </div>            
        )
    }
}

export default Search;


// const props = {
//   name: 'file',
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//   headers: {
//     authorization: 'authorization-text',
//   },
//   onChange(info) {
//     if (info.file.status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };

// ReactDOM.render(
//   <Upload {...props}>
//     <Button>
//       <UploadOutlined /> Click to Upload
//     </Button>
//   </Upload>,
//   mountNode,
// );