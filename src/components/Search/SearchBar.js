import React, { Component } from 'react';
import { Select } from 'antd';
//, Upload, message, Button } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';
import { COUNTIES } from '../../utils/constants.js';


class SearchBar extends Component {
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
            const label = county.geoid.length === 2 ? county.name :
                `${county.name}, ${county.usps}`;

            child.button.push(
                <Option
                    key={`${county.geoid}-county`}
                    value={county.geoid}>
                    {label}
                </Option>
            )
            children.push(child);
        }

        // FileUploader can go inside dropdown, although it may not be intuitive
        // const child = {
        //     key: "uploaded-county",
        //     button: []
        // } 
        // child.button.push(
        //     <Option
        //         key="uploaded-county"
        //         value="uploaded-county">
        //         <label
        //             htmlFor="upload">
        //             Don't see your county? Click to upload a file 
        //         </label>
        //         <input
        //             type="file"
        //             id="upload"
        //             onChange={this.handleUpload}>
        //         </input>
        //     </Option>
        // )
        // children.push(child)

        this.setState({children})
    }

    handleCountySelect = (event) => {
        console.log('county select')

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
        console.log('starting upload')
        // antd uploader doesn't provide data to fileRead
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        //   }
        //   if (info.file.status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully`);
        //   } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        //   }
        
        // event sent from old bootstrap upload element
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
        console.log('upload')
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
        // const { fileName, countyName } = this.state;
        // const countyLabel = countyName === '' ? 'Search for your county' : countyName;
        // const uploadLabel = fileName === '' ? 'Upload File' : fileName;

        // const props = {
        //     name: 'file',
        //     action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        //     headers: {
        //       authorization: 'authorization-text',
        //     },
        //     onChange(info) {
        //       if (info.file.status !== 'uploading') {
        //         console.log(info.file, info.fileList);
        //       }
        //       if (info.file.status === 'done') {
        //         message.success(`${info.file.name} file uploaded successfully`);
        //       } else if (info.file.status === 'error') {
        //         message.error(`${info.file.name} file upload failed.`);
        //       }
        //     },
        //   };
          
        return (
            <Select
                showSearch
                placeholder={this.props.placeholder}
                optionFilterProp="children"
                style={this.props.style}
                size={this.props.size}
                onChange={this.handleCountySelect}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {this.state.children.map(county => county.button)}
            </Select>
        )
    }
}

export default SearchBar;

// {/* <Col className="gutter-row" span={6}> */}
//     {/* <Upload {...props}>
//         <Button>
//             <UploadOutlined /> Upload
//         </Button>
//     </Upload> */}
// {/* </Col> */}