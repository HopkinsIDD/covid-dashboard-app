import React, { Component } from 'react';
import { Layout, Col } from 'antd';
import { styles } from '../utils/constants';

class Methodology extends Component {
  
    render() {
        const { Content } = Layout;
        return (
            <Content id="methods" style={styles.ContainerWhite}>
                <Col className="gutter-row container">
                    <div className="content-section">
                        <div className="methods-header">Methodology</div> 
                        <div>
                        The visualizations on this page are results of a scenario modeling pipeline that consists of multiple modular 
                        components designed to produce results focused on policy relevant outcomes.
                        The current core components are epidemic seeding, the transmission model, health outcome generation engine, and report generation. 
                        <ul>
                          <li><b>Epidemic Seeding</b>: This refers to how the disease transmission module is initialized with infected individuals. 
                          Currently, the pipeline can be seeded according to first case appearance in data or seeding according to an air travel importation model.</li>
                          <li><b>Transmission Model and Intervention Scenarios</b>: This module produces an epidemic model output file that contains daily counts of incident infections, indexed to their time of symptom onset. 
                          The currently implemented default transmission module comprises a metapopulation model with stochastic Susceptible-Exposed-Infected-Recovered (SEIR) disease dynamics.</li>
                          <li><b>Calculation of Health Outcomes</b>: This module translates outputs from the transmission model, taking in counts of daily incident infections and produces daily counts for specific health outcomes, 
                          such as hospital and intensive care unit (ICU) admissions, current hospital and ICU occupancy, ventilators needs, and number of deaths.</li>
                          <li><b>Result Generation</b>: In the open-source repository, we provide plotting functions to access results and produce reports focused on policy relevant outcomes.</li>
                        </ul>
                        </div>
                        <div className="methods-header">Inference</div> 
                        <div>
                            We built an inference framework to be able to calibrate simulated epidemic trajectories to observed epidemic data. 
                            Calibrated parameters of our modeling framework, which are all potentially location-specific, include epidemic seeding 
                            dates and amounts, values of the basic reproduction number, and the effectiveness of different types of NPIs. 
                            Inference on model parameters for each spatial location are drawn jointly given the spatial coupling of COVID-19 transmission dynamics.
                        </div>                    
                        <div className="methods-header">Discussion</div> 
                        <div>
                            We present our scenario pipeline as an open-source modeling framework that aims to balance epidemiological rigor with the flexibility and urgency required by public health policymaking. 
                            The modularity of our framework has enabled us to adapt our assumptions about COVID-19 epidemiology, transmission, and health outcome risks in response to emerging information and to different settings. 
                            The pipeline implementation of non-pharmaceutical interventions is highly adaptable for policymakers desiring to compare the impact of different potential scenarios.
                        </div>
                        <div className="methods-header">Limitations</div> 
                        <div>
                            The current implementation of our model has several limitations. We do not explicitly model the role of asymptomatic transmission or other factors that may lead to biases in reporting. 
                            In addition, the delays and durations involved in our health outcomes progression are fixed values, despite high variability in the estimates of these values. 
                            Our epidemic simulations do not account for age-specific transmission, so our model cannot capture the impact of strategies such as cocooning of high-risk age groups beyond 
                            population-level reductions in disease transmission. 
                        </div>
                        <div className="methods-header">Further Information</div> 
                        <div>
                            The original research paper, <a className="customLink" href="https://www.medrxiv.org/content/10.1101/2020.06.11.20127894v1.full.pdf">"A scenario modeling pipeline for COVID-19 emergency planning"</a>.
                            <br />
                            The open-source repository for the project, <a className="customLink" href="https://github.com/HopkinsIDD/COVIDScenarioPipeline/">COVIDScenarioPipeline Github</a>.
                        </div>
                    </div>
                </Col>
            </Content>
        )
    }
}

export default Methodology;
