import React, { Component } from 'react';
import { Radio } from 'antd';
// import TooltipHandler from '../Filters/TooltipHandler';
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
            <Radio.Group
                value={value}
                style={{ width: '80%', marginTop: '5%' }}
                onChange={this.props.onConfClick}>
                <Radio.Button
                    key="exceedence" 
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                    value="exceedence">
                    Exceedence
                </Radio.Button>
                <Radio.Button
                    key="confidence"
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                    value="confidence">
                    Confidence
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
        )
    }
}

export default Switch
