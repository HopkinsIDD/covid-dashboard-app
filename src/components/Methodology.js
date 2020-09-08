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
                        The visualizations on this page are results of a scenario modeling pipeline 
                        that consists of multiple modular components designed to produce results 
                        focused on policy relevant outcomes. The model components are epidemic seeding, 
                        the disease transmission model, and a health outcomes model.
                        <ul>
                          <li><b>Epidemic Seeding</b>: This refers to how the disease 
                          transmission module is initialized with infected individuals. 
                          Currently, the pipeline can be seeded according to the first 
                          appearance of cases in the data or according to a model of air importation risk.
                          </li>
                          <li><b>Disease Transmission</b>: 
                          Epidemics are simulated according to a county-level metapopulation model 
                          with stochastic Susceptible-Exposed-Infected-Recovered (SEIR) disease dynamics. 
                          Statewide non-pharmaceutical interventions (NPIs) reduce the reproduction number 
                          throughout the model simulation according to real-world policy information. 
                          We construct scenarios by stacking NPIs across different locations and times, 
                          and multiple stochastic epidemic simulations are run for each scenario 
                          (as displayed in the dashboard tool). 
                          The model outputs daily counts of incident infections for each model location.
                          </li>
                          <li><b>Health Outcomes</b>: 
                          This model translates infection counts from the transmission model into 
                          projections of confirmed cases, hospitalizations, ICU admissions, ventilators used, 
                          and deaths after accounting for the probability, time delay, and duration 
                          of these more severe health outcomes. 
                          Risks are standardized according to the age distribution of a given county’s 
                          population based on our best estimates from the scientific literature.
                          </li>
                        </ul>
                        </div>
                        <div className="methods-header">Inference</div> 
                        <div>
                            We built an inference framework to be able to calibrate simulated 
                            epidemic trajectories to observed epidemic data. 
                            Calibrated parameters of our modeling framework, which are 
                            all potentially location-specific, include epidemic seeding 
                            dates and amounts, values of the basic reproduction number, 
                            and the effectiveness of different types of NPIs. 
                            Inference on model parameters for each spatial location are 
                            drawn jointly given the spatial coupling of COVID-19 transmission dynamics.
                        </div>                    
                        <div className="methods-header">Limitations</div> 
                        <div>
                            We do not explicitly model the role of asymptomatic transmission or other factors 
                            that may lead to biases in reporting. 
                            In addition, the delays and durations involved in our health outcomes 
                            progression are fixed values, despite high variability in the estimates 
                            of these values. Our epidemic simulations do not account for age-specific 
                            transmission, so our model cannot capture the impact of strategies such as 
                            cocooning of high-risk age groups beyond population-level 
                            reductions in disease transmission.
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
