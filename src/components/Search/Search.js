import React, { Component } from 'react';
import { Layout } from 'antd';
import SearchBar from './SearchBar';


class Search extends Component {
    handleUpload = (i) => {
        this.props.onFileUpload(i);
    }

    handleCountySelect = (i) => {
        this.props.onCountySelect(i);
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
                        Find your county in our registry or upload 
                        a model file to start comparing scenarios.
                    </div>
                </div>
                <SearchBar
                    stat={this.props.stat}
                    geoid={this.props.geoid}
                    onFileUpload={this.handleUpload}
                    onCountySelect={this.handleCountySelect}
                />
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
