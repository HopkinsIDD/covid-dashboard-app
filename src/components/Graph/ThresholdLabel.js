import React from 'react';
import { addCommas } from '../../utils/utils.js';

function ThresholdLabel(props) {
    const chance = Math.round(100 * props.percExceedence);
    const val = addCommas(props.statThreshold);
    const dateObj = new Date(Date.parse(props.dateThreshold));
    const dateArray = dateObj.toDateString().split(' ').slice(1);
    const date = dateArray[0] + ' ' + dateArray[1] + ', ' + dateArray[2];

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