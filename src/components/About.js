import React, { Component } from 'react';
import { Layout, Col, Row } from 'antd';
import { styles } from '../utils/constants';

class About extends Component {
  
    render() {
        const { Content } = Layout;
        return (
            <Content id="about" style={styles.ContainerGray}>
                <Col className="gutter-row container">
                    <div className="content-section">
                        <div className="content-header">About</div>
                        <br />
                        <div className="methods-header">The Model</div> 
                        <div>     
                            The source code for both the model and this website is open source 
                            and available on Github. Core pipeline source code can be found&nbsp;
                            <a className="customLink"
                            href="https://github.com/HopkinsIDD/COVIDScenarioPipeline/">
                            here</a>. Source code for this website can be found&nbsp;
                            <a className="customLink"
                            href="https://github.com/HopkinsIDD/covid-dashboard-app">
                            here</a>. Please file any feature requests or issues&nbsp;
                            <a className="customLink"
                            href="https://github.com/HopkinsIDD/covid-dashboard-app/issues">
                            here</a>. 
                        </div>
                    </div>

                    <div className="methods-header">The Team</div> 
                    <div className="content-section">
                        This work would not be possible without the efforts of 
                        the COVID-19 Scenario Modeling Pipeline Working Group.
                    </div>
                </Col>

                <Col className="gutter-row container" span={24}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={10} offset={2}>
                            <div className="content-section">
                                <div><b>EPFL</b></div>
                                <ul>
                                    <li>Joseph C. Lemaitre</li>
                                </ul>

                                <div><b>Johns Hopkins Infectious Disease Dynamics</b></div>
                                <ul>
                                    <li>Qifang Bi</li>
                                    <li>Jacob Fiksel</li>
                                    <li>Kyra H. Grantz</li>
                                    <li>Joshua Kaminsky</li>
                                    <li>Stephen A. Lauer</li>
                                    <li>Elizabeth C. Lee</li>
                                    <li>Justin Lessler</li>
                                    <li>Hannah R. Meredith</li>
                                    <li>Shaun A. Truelove</li>
                                </ul>
        
                                <div><b>University of Utah</b></div>
                                <ul>
                                    <li>Lindsay T. Keegan</li>
                                </ul>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={10} offset={2}>
                            <div className="content-section">
                                <div><b>Developers Without Affiliation</b></div>
                                <ul>
                                    <li>Ian Chamberlain</li>
                                    <li>Kathryn Kaminsky</li>
                                    <li>Sam Shah</li>
                                    <li>Josh Wills</li>                            
                                </ul>

                                <div><b>Amazon Web Services</b></div>
                                <ul>
                                    <li>Pierre-Yves Aquilanti</li>
                                    <li>Karthik Raman</li>
                                    <li>Arun Subramaniyan</li>
                                    <li>Greg Thursam</li>
                                    <li>Anh Tran</li>                  
                                </ul>
                                
                                <div><b>U.S. Digital Response</b></div>
                                <ul>
                                    <li>Genevieve Hoffman</li>
                                    <li>Lily Xu</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col className="gutter-row container">
                    <div className="content-section">
                        <div className="methods-header">Contact</div> 
                        <div>
                            Questions? Comments? Issues? 
                            Email us at email [@] jhu.com 
                        </div>
                    </div>
                </Col>
            </Content>
        )
    }
}

export default About;