import React, { Component } from 'react';
import { Layout, Col, Row, Switch } from 'antd';
import SearchBar from './SearchBar';
import FileUploader from './FileUploader';
import { ReactComponent as GraphLogo } from '../../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../../assets/chart.svg';
import { ReactComponent as MapLogo } from '../../assets/globe.svg';
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
            <Content id="search" style={styles.ContainerWhite}>
                <Col className="gutter-row container">
                    <div className="title-header">COVID-19 Intervention Scenario Modeling</div>
                </Col>

                <Col className="gutter-row container" span={16}>
                    <div className="content-section">
                        <div>The&nbsp;
                            <a className="customLink" href="http://www.iddynamics.jhsph.edu/">
                            Johns Hopkins IDD Working Group</a> has generated model 
                            simulations for select intervention scenarios from 
                            January 2020 to June 2021. Scroll down to compare scenarios
                            by: 
                        </div>
                        <ul>
                            <li>
                                <span>
                                    <GraphLogo
                                        className="nav-active"
                                        height={20}
                                        width={35}
                                        style={styles.iconGraph}/>
                                </span>
                                Interacting with individual simulation curves
                            </li>
                            <li>
                                <span>
                                    <ChartLogo
                                        className="nav-active"
                                        height={20}
                                        width={25}
                                        style={styles.iconChart}/>
                                </span>
                                Exploring expected number of hospitalizations, 
                                deaths, etc. in the coming weeks
                            </li>
                            <li>
                                <span>
                                    <MapLogo
                                        className="nav-active"
                                        height={20}
                                        width={30}
                                        style={styles.iconMap}/>
                                </span>
                                Visualizing state-wide trends
                            </li>
                        </ul>
                        <br />
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
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={styles.Switch}>
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
            </Content>
        )
    }
}

export default Search;
