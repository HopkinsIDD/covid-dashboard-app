import React, { Component, Fragment } from 'react';
import { Radio } from 'antd';
import TooltipHandler from '../Filters/TooltipHandler';
// import { styles } from '../../utils/constants';

class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false
        }
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    render() {
        const value = this.props.showConfBounds ? "confidence" : "exceedence";
        return (  
            <Fragment>
                <div className="param-header">MODE
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip ?
                            <span className="tooltip-text">
                                The Threshold Exceedence mode displays simulations output from the model
                                and allows you to filter by R<sub>0</sub> and determine the chance
                                of various thresholds being met by a certain date. The Confidence Bounds
                                mode allows you to view the average across all simulations output from the
                                model, as well as the upper and lower p90 and p10 confidence bounds, which depict the
                                range of possible outcomes with a 90% chance of happening.              
                            </span> 
                            : null}
                        </div>
                    </TooltipHandler>
                </div>
                <Radio.Group
                    value={value}
                    style={{ width: '70%', display: 'flex' }}
                    onChange={this.props.onConfClick}>
                    <Radio.Button
                        key="exceedence" 
                        style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '5px', lineHeight: '1.2rem', height: '50px' }}
                        value="exceedence">
                        Threshold Exceedence
                    </Radio.Button>
                    <Radio.Button
                        key="confidence"
                        style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '5px', lineHeight: '1.2rem', height: '50px' }}
                        value="confidence">
                        Confidence Bounds
                    </Radio.Button>
                    {/* <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip ?
                            <span className="tooltip-text">
                                The boundaries in the graph display the 10%, 50%, 
                                and 90% confidence intervals. 
                                Confidence intervals are
                                an estimate of the population based on the 
                                based on the entire set of simulation curves.  
                            </span> 
                            : null}
                        </div>
                    </TooltipHandler> */}
                </Radio.Group> 
            </Fragment>  
        )
    }
}

export default Switch
