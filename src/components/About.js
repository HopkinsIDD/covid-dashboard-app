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
                            COVID-19 has caused worldwide strain on health systems due 
                            to its high mortality rate and the large portion of cases 
                            requiring critical care and mechanical ventilation. 
                            Public health decision makers, from city health departments 
                            to federal agencies, sought the use of epidemiological models 
                            for decision support in allocating resources, developing 
                            non-pharmaceutical interventions, and characterizing the 
                            dynamics of COVID-19 in their jurisdictions. In response, 
                            the JHU ID Dynamics COVID-19 Working Group developed a 
                            flexible scenario modeling pipeline that could quickly 
                            tailor models for decision makers seeking to compare projections 
                            of epidemic trajectories and healthcare impacts from multiple 
                            intervention scenarios in different locations.
                            <br /><br />
                            The methods paper on the COVID Scenario Pipeline for scenario 
                            planning has not yet been peer-reviewed and can be found 
                            on a preprint server&nbsp;
                            <a className="customLink"
                            href="https://www.medrxiv.org/content/10.1101/2020.06.11.20127894v1.full.pdf">
                            here</a>. An additional paper on the inference 
                            framework of our model is forthcoming.
                        </div>
                            
                        <div className="methods-header">Model</div> 
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

                    <div className="methods-header">Team</div> 
                    <div className="content-section">
                        This work was developed by the&nbsp;
                        <a className="customLink" href="http://www.iddynamics.jhsph.edu/">
                        Johns Hopkins ID Dynamics</a> COVID-19 Working Group.
                    </div>
                </Col>

                <Col className="gutter-row container" span={24}>
                    <Row gutter={styles.gutter}>
                        <Col className="gutter-row" span={10} offset={2}>
                            <div className="content-section">
                                <div><b>Ecole Polytechnique Fédérale de Lausanne</b></div>
                                <ul>
                                    <li>Joseph C. Lemaitre</li>
                                </ul>

                                <div><b>Johns Hopkins Infectious Disease Dynamics</b></div>
                                <ul>
                                    <li>Kyra H. Grantz</li>
                                    <li>Juan Dent Hulse</li>
                                    <li>Joshua Kaminsky</li>
                                    <li>Stephen A. Lauer</li>
                                    <li>Elizabeth C. Lee</li>
                                    <li>Justin Lessler</li>
                                    <li>Hannah R. Meredith</li>
                                    <li>Javier Perez-Saez</li>
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
                        <div className="methods-header">Acknowledgements</div> 
                        <div>
                        This project was supported by the State of California, 
                        the U.S. Department of Homeland Security, 
                        the U.S. Department of Health and Human Services, 
                        the Johns Hopkins Health System, Amazon Web Services, 
                        the Office of the Dean at the Johns Hopkins Bloomberg School of Public Health, 
                        the Swiss National Science Foundation, 
                        the U.S. Office of Foreign Disaster Assistance, 
                        and the U.S. Centers for Disease Control and Prevention.
                        </div>
                    </div>
                </Col>

                <Col className="gutter-row container">
                    <div className="content-section">
                        <div className="methods-header">Contact</div> 
                        <div>
                            Questions? Comments? Issues? 
                            Email us at iddynam [@] jhu.com 
                        </div>
                    </div>
                </Col>
            </Content>
        )
    }
}

export default About;