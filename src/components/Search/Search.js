import React, { Component } from 'react';
import { Layout } from 'antd';
import SearchBar from './SearchBar';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: ''
        }
    }

    handleCountySelect = (i) => {
        this.props.onCountySelect(i);
    }

    handleUpload = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            if (this.validateSize(file) && this.validateType(file)) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const json = JSON.parse(fileReader.result);
                    this.props.onFileUpload(json);
                    console.log('json', json)
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
        const { Content } = Layout;
        return (
            <Content style={{ background: 'white', padding: '50px 0' }}>
                <div className="content-section">
                    <div className="content-header">
                        Intervention Scenario Modeling
                    </div>
                    <div>
                        Find your county in our registry 
                        to start comparing scenarios now.
                    </div>
                </div>
                <SearchBar
                    stat={this.props.stat}
                    geoid={this.props.geoid}
                    // onFileUpload={this.handleUpload}
                    onCountySelect={this.handleCountySelect}
                />

                {/* <div className="content-section">
                    <label
                        htmlFor="upload">
                        Greetings
                    </label>
                    <input
                        type="file"
                        id="upload"
                        onChange={this.handleUpload}>
                    </input>
                </div> */}

                <div className="content-section">
                    Prepared by the&nbsp;
                    <a
                        className="customLink"
                        href="http://www.iddynamics.jhsph.edu/">
                        Johns Hopkins IDD
                    </a>
                    &nbsp;Working Group.
                </div>
            </Content>       
        )
    }
}

export default Search;
