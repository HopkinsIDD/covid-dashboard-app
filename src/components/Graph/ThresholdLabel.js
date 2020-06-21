import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import { addCommas, getReadableDate } from '../../utils/utils.js';

class ThresholdLabel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false,
            chance: Math.round(100 * props.percExceedence),
            val: addCommas(Math.ceil(props.statThreshold / 100) * 100),
            date: getReadableDate(props.dateThreshold),
            activeClass: 'bold underline',
            statClass: 'bold underline',
            dateClass: 'bold underline'
        }
    }

    componentDidUpdate(prevProp) {
        const { percExceedence, statThreshold, dateThreshold, statSliderActive, dateSliderActive } = this.props;

        if (percExceedence !== prevProp.percExceedence) {
            this.setState({ chance: Math.round(100 * percExceedence) }
        )}
        if (statThreshold !== prevProp.statThreshold) {
            this.setState({ val: addCommas(Math.ceil(statThreshold / 100) * 100) }
        )}
        if (dateThreshold !== prevProp.dateThreshold) {
            this.setState({ date: getReadableDate(dateThreshold) }
        )}
        if (statSliderActive !== prevProp.statSliderActive ||
            dateSliderActive !== prevProp.dateSliderActive) {
            this.setState({ 
                activeClass: statSliderActive || dateSliderActive ? 'underline-active' : 'bold underline',
                statClass: statSliderActive ? 'underline-active' : 'bold underline',
                dateClass: dateSliderActive ? 'underline-active' : 'bold underline',
            }
        )}    
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    render() {
        const { chance, val, date, activeClass, statClass, dateClass } = this.state;

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