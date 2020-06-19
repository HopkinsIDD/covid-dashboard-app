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
                        <div className="methods-header">About</div> 
                        <div>     
                            COVID-19 has caused worldwide strain on health systems 
                            due to its high mortality rate and the large portion of 
                            cases requiring critical care and mechanical ventilation. 
                            During these uncertain times, public health decision makers, 
                            from city health departments to federal agencies, sought 
                            the use of epidemiological models for decision support in 
                            allocating resources, developing non-pharmaceutical 
                            interventions, and characterizing the dynamics of COVID-19 
                            in their jurisdictions. In response, the COVID-19 Scenario 
                            Modeling Pipeline Working Group developed a flexible 
                            scenario modeling pipeline that could quickly tailor 
                            models for decision makers seeking to compare projections 
                            of epidemic trajectories and healthcare impacts from 
                            multiple intervention scenarios in different locations. 
                            <br /><br />
                            The original research on the scenario modeling pipeline
                            for COVID-19 emergency planning can be found&nbsp;
                            <a className="customLink"
                            href="https://www.medrxiv.org/content/10.1101/2020.06.11.20127894v1.full.pdf">
                            here</a>.
                        </div>
                            
                        <div className="methods-header">The Model</div> 
                        <div>     
                            The scenario modeling pipeline is open-source under the
                            GNU General Public License v3 and <a className="customLink"
                            href="https://github.com/HopkinsIDD/COVIDScenarioPipeline/">
                            available on Github</a>. The source code for this visualization 
                            tool is also open source and <a className="customLink"
                            href="https://github.com/HopkinsIDD/covid-dashboard-app">
                            available on Github</a>. Please file any feature requests or issues&nbsp;
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