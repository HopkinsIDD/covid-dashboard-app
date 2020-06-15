import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import { addCommas, getReadableDate } from '../../utils/utils.js';

class ThresholdLabel extends Component {
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
        const chance = Math.round(100 * this.props.percExceedence);
        const val = addCommas(Math.ceil(this.props.statThreshold / 100) * 100);
        const date = getReadableDate(this.props.dateThreshold);
    
        const activeClass = this.props.statSliderActive || this.props.dateSliderActive ? 
            'underline-active' : 'bold underline';
        const statClass = this.props.statSliderActive ? 
            'underline-active' : 'bold underline';
        const dateClass = this.props.dateSliderActive ? 
            'underline-active' : 'bold underline';

        return (
            <div className={`${this.props.classProps} desktop-only`}>
                <span className={activeClass}>{chance}%</span>
                &nbsp;{`of simulations shown predict daily ${this.props.label} to exceed`}&nbsp;
                <span className={statClass}>{val}</span>
                &nbsp;by&nbsp;
                <span className={dateClass}>{date}</span>
                <TooltipHandler
                    showTooltip={this.state.showTooltip}
                    onClick={this.handleTooltipClick}
                    >
                    <div className="tooltip">&nbsp;&#9432;
                        {this.state.showTooltip &&
                        <span className="tooltip-text">
                            This percentage is calculated using the remaining 
                            simulation curves after filtering on all parameters 
                            from the side menu, not on all possible simulation 
                            curves available for this scenario.
                        </span> }
                    </div>
                </TooltipHandler>
            </div>
        )
    }
}

export default ThresholdLabel