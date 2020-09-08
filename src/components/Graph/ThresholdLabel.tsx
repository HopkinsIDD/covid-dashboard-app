import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import { addCommas, getReadableDate, getStepValue } from '../../utils/utils';
import { getClassForActiveState, LabelClassName, LabelClassNameEnum } from "../../utils/typeUtils";


interface Props {
    percExceedence: number,
    onConfClick: () => void,
    indicatorThreshold: number,
    dateThreshold: Date,
    statSliderActive: boolean,
    dateSliderActive: boolean,
    classProps: string,
    label: string,
    seriesMax: number,
}

interface State {
    showTooltip: boolean,
    activeClass: LabelClassName,
    statClass: LabelClassName,
    dateClass: LabelClassName,
    chance: number,
    val: string,
    date: string,
}

class ThresholdLabel extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showTooltip: false,
            chance: Math.round(100 * props.percExceedence),
            val: addCommas(Math.ceil(props.indicatorThreshold / 100) * 100),
            date: getReadableDate(props.dateThreshold),
            activeClass: LabelClassNameEnum.boldUnderline,
            statClass: LabelClassNameEnum.boldUnderline,
            dateClass: LabelClassNameEnum.boldUnderline
        }
    }

    componentDidUpdate(prevProp: Props) {
        const { percExceedence, indicatorThreshold, dateThreshold, statSliderActive, dateSliderActive, seriesMax } = this.props;

        if (percExceedence !== prevProp.percExceedence) {
            this.setState({ chance: Math.round(100 * percExceedence) }
        )}
        if (indicatorThreshold !== prevProp.indicatorThreshold) {
            const stepVal = getStepValue(seriesMax)
            const roundedStat = Math.ceil(indicatorThreshold / stepVal) * stepVal;
            this.setState({ val: addCommas(roundedStat) }
        )}
        if (dateThreshold !== prevProp.dateThreshold) {
            this.setState({ date: getReadableDate(dateThreshold) }
        )}
        if (statSliderActive !== prevProp.statSliderActive ||
            dateSliderActive !== prevProp.dateSliderActive) {
            this.setState({
                activeClass: getClassForActiveState(statSliderActive || dateSliderActive),
                statClass: getClassForActiveState(statSliderActive),
                dateClass: getClassForActiveState(dateSliderActive),
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
                            This percentage is calculated only for model simulations that 
                            meet the criteria specified in the control panel. 
                            Modify the Threshold and Date Threshold sliders in 
                            “Threshold Exceedance” mode to see how this percentage changes.
                        </span> }
                    </div>
                </TooltipHandler>
            </div>
        )
    }
}

export default ThresholdLabel
