import React from 'react';
import { addCommas, getReadableDate } from '../../utils/utils.js';

function ThresholdLabel(props) {
    const { r0full, r0selected } = props;
    const chance = Math.round(100 * props.percExceedence);
    const val = addCommas(Math.ceil(props.statThreshold / 100) * 100);
    const date = getReadableDate(props.dateThreshold);

    if (r0selected[0] === r0full[0] && r0selected[1] === r0full[1] ) {
        return (
            <p className={props.classProps}>
                <span className={props.statSliderActive || props.dateSliderActive ? 'underline-active' : 'bold underline'}>{chance}%</span>
                &nbsp;{`chance daily ${props.label} exceed`}&nbsp;
                <span className={props.statSliderActive ? 'underline-active' : 'bold underline'}>{val}</span>
                &nbsp;by&nbsp;
                <span className={props.dateSliderActive ? 'underline-active' : 'bold underline'}>{date}</span>
            </p>
        )
    } else {
        return null;
    }
}

export default ThresholdLabel