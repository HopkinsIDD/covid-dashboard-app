import React from 'react';
import { addCommas, getReadableDate } from '../../utils/utils.js';

function ThresholdLabel(props) {
    const chance = Math.round(100 * props.percExceedence);
    const val = addCommas(Math.ceil(props.statThreshold / 100) * 100);
    const date = getReadableDate(props.dateThreshold);

    return (
        <p className={props.classProps}>
            <span className={props.statSliderActive || props.dateSliderActive ? 'customLink' : 'bold'}>{chance}%</span>
            &nbsp;{`chance daily ${props.label} exceed`}&nbsp;
            <span className={props.statSliderActive ? 'customLink' : 'bold'}>{val}</span>
            &nbsp;by&nbsp;
            <span className={props.dateSliderActive ? 'customLink' : 'bold'}>{date}</span>
        </p>
        )
}

export default ThresholdLabel