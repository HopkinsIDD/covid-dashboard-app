import React, { Component } from 'react';
import { Layout, Col, Row, Switch } from 'antd';
import FileUploader from './FileUploader';
import { ReactComponent as GraphLogo } from '../../assets/graph.svg';
import { ReactComponent as ChartLogo } from '../../assets/chart.svg';
import { ReactComponent as MapLogo } from '../../assets/globe.svg';
import { styles } from '../../utils/constants';
import { GeoId } from "../../utils/constantsTypes";
import SearchBar from "./SearchBar";

interface Props {
    onCountySelect: () => void,
    onFileUpload: (json: JSON, geoId: GeoId) => void,
    geoid: GeoId,
}

interface State {
    fileName: string,
    showFileUpload: boolean,
}

class Search extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fileName: '',
            showFileUpload: false,
        }
    }

    handleUpload = (json: JSON, geoId: GeoId) => {
        console.log('handleUpload', json, geoId)
        this.props.onFileUpload(json, geoId);
    };

    handleUploadToggle = () => {
        this.setState({ showFileUpload: !this.state.showFileUpload })
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

                <Col className="gutter-row container">
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
                        <br/>
                        <div>
                            Find your state or county in our registry
                            to start comparing scenarios now.
                        </div>
                        <SearchBar
                            onCountySelect={this.props.onCountySelect}
                            style={styles.SearchBar}/>
                        <Row gutter={styles.gutter} style={styles.Switch}>
                            <Switch
                                style={{ 'marginTop': '0.1rem' }}
                                onChange={this.handleUploadToggle}
                                size="small"/>
                            <div className="upload-toggle">{uploadMessage}</div>
                        </Row>
                        <br/>
                        {showFileUpload &&
                        <FileUploader onUpload={this.handleUpload}/>}
                    </div>
                </Col>
            </Content>
        )
    }
}

export default Search;
