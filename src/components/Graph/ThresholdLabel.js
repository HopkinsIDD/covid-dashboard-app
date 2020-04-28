import React from 'react';
import { addCommas, readableDate } from '../../utils/utils.js';

function ThresholdLabel(props) {
    const chance = Math.round(100 * props.percExceedence);
    const val = addCommas(props.statThreshold);
    const date = readableDate(props.dateThreshold);

    return (
        <p className="filter-label threshold-label">
            <span className="bold">{chance}%</span>
            &nbsp;chance daily infections exceed&nbsp;
            <span className="bold">{val}</span>
            &nbsp;by&nbsp;
            <span className="bold">{date}</span>
        </p>
        )
}

export default ThresholdLabel