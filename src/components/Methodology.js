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
                        <div className="content-header">Methodology</div>
                        <br />
                        {/* <div style={{ textAlign: 'left' }}>                    
                            Prepared by the&nbsp;
                            <a className="customLink"
                                href="http://www.iddynamics.jhsph.edu/">
                                Johns Hopkins IDD
                            </a>
                            &nbsp;Working Group.
                        </div>*/}
                        <div className="methods-header">Pipeline Overview</div> 
                        <div>
                            The model results here are the results of a modeling 
                            pipeline that moves from a seeding phase, through epidemic simulation, 
                            a outcome and hospitalization generation engine, and report generation. 
                            Core code for all aspects of the pipeline is all open source. 
                            The core pipeline phases are:
                            <ul>
                                <li><b>Seeding</b>: We run a model to determine the likelihood of importing cases into the region of interest. We maintain an R package.</li>
                                <li><b>Epidemic Simulation</b>: We run a location stratified SEIR model, using a python module in COVIDScenarioPipeline.</li>
                                <li><b>Hospitalization and Outcome Generator</b>: We estimate secondary effects of infection using infection numbers using the hospitalization R package in COVIDScenarioPipeline.</li>
                                <li><b>Report Generation</b>: We provide functions to access results and help produce reports in the report_generation R package in COVIDScenarioPipeline.</li>
                            </ul>
                        </div>
                        <div className="methods-header">Technical Details</div> 
                        <h4>Epidemic Simulation</h4> 
                        <div>
                            We used an air importation model in conjunction with the cumulative confirmed COVID case data from JHU CSSE COVID-19 Data Portal and assumptions in recent travel reductions to estimate the number of COVID case importations into major airports located in California and surrounding areas (CA, NV, AZ, OR, WA) from January through March. These importations were used to seed our epidemic model.
                            If the number of infections in any single county was below the number of confirmed cases reported by the JHU CSSE COVID-19 Data Portal on a given day between February 1 and March 18, the simulation was stopped and removed from the model results. We ran 1000 model simulations from January 31, 2020 through June 01, 2021 for each scenario. Some outcomes may be reported beyond the simulation period in order to examine the full disease course for infections occurring at the end of the simulation period.
                        </div>
                        <div className="methods-header">Limitations</div> 
                        <div>Coming soon...</div>
                        <div className="methods-header">Key Sources</div> 
                        <div>Coming soon...</div>
                    </div>
                </Col>
            </Content>
        )
    }
}

export default Methodology;
