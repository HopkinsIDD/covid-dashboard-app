import React, { Component } from 'react';
import { Layout, Col, Row, Switch } from 'antd';
import SearchBar from './SearchBar';
import FileUploader from './FileUploader';
// import UploadSwitch from './UploadSwitch';
import { styles } from '../../utils/constants';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            showFileUpload: false,
        }
    }

    handleCountySelect = (event) => {
        this.props.onCountySelect(event);
    }

    handleUpload = (event, name) => {
        console.log('handleUpload', event, name)
        this.props.onFileUpload(event, name);
    }

    handleUploadToggle = () => {
        this.setState({showFileUpload: !this.state.showFileUpload})
    };

    render() {
        const { showFileUpload } = this.state;
        const { Content } = Layout;
        const uploadMessage = showFileUpload ? 
            "Upload File provided by the Johns Hopkins IDD Working Group, for example, geo06085.json" : 
            "Upload File";
        return (
            <Content>
                <div id="search-container" className="search-container">
                    <Col className="gutter-row container">
                        <div className="content-section">
                            <div className="title-header">
                                COVID-19 Intervention Scenario Modeling
                            </div>
                        <div>
                            Find your state or county in our registry 
                            to start comparing scenarios now.
                        </div>
                        <div className="dropdown">
                            <SearchBar
                                geoid={this.props.geoid}
                                onCountySelect={this.handleCountySelect}
                                style={styles.SearchBar}
                                size="large"
                            />
                        </div>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={styles.UploadSwitch}>
                            <Switch
                                style={{ 'marginTop': '0.1rem' }}
                                onChange={this.handleUploadToggle}
                                size="small"/>
                            <div className="upload-toggle">{uploadMessage}</div>
                        </Row>   
                        <br />
                        {showFileUpload ? 
                            <FileUploader onUpload={this.handleUpload}/> 
                            : null}
                    </div>
                    </Col>
                </div>  
            </Content>
        )
    }
}

export default Search;
