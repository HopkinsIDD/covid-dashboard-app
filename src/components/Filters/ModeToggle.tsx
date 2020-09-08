import React, { Component, Fragment } from 'react';
import { Radio } from 'antd';
import TooltipHandler from './TooltipHandler';
import { styles } from '../../utils/constants';

interface Props {
    showConfBounds: boolean,
    onConfClick: () => void,
}

interface State {
    showTooltip: boolean,
}

class ModeToggle extends Component<Props, State> {
    constructor(props: Props) {
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
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                                In “Confidence Bounds” mode, you can see a time-averaged 
                                median line and 10-90% prediction interval ribbon for all 
                                model simulations overlaid in green on top of the individual simulations. 
                                <br /><br />
                                In “Threshold Exceedance” mode, you can use the Threshold and Date 
                                Threshold sliders to change values and dates to determine how likely 
                                a given indicator will exceed a certain threshold number by 
                                a given threshold date. Simulation curves that exceed the 
                                designated threshold will appear red, while the rest 
                                of the curves will be green.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <Radio.Group
                    value={value}
                    style={{ width: '70%', display: 'flex' }}
                    onChange={this.props.onConfClick}>
                    <Radio.Button
                        key="confidence"
                        style={styles.Radio}
                        value="confidence">
                        Confidence Bounds
                    </Radio.Button>
                    <Radio.Button
                        key="exceedence"
                        style={styles.Radio}
                        value="exceedence">
                        Threshold Exceedance
                    </Radio.Button>
                </Radio.Group>
            </Fragment>
        )
    }
}

export default ModeToggle
