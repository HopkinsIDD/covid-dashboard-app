import React from 'react';
import { addCommas, getReadableDate } from '../../utils/utils.js';

function ThresholdLabel(props) {
    const chance = Math.round(100 * props.percExceedence);
    const val = addCommas(Math.ceil(props.statThreshold / 100) * 100);
    const date = getReadableDate(props.dateThreshold);

    return (
        <p className={props.classProps}>
            <span className="bold">{chance}%</span>
            &nbsp;{`chance daily ${props.label} exceed`}&nbsp;
            <span className="bold">{val}</span>
            &nbsp;by&nbsp;
            <span className="bold">{date}</span>
        </p>
        )
}

export default ThresholdLabel