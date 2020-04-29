import React from 'react';
import { green, red } from '../../store/constants';

function Legend(props) {
    if (!props.showConfBounds) {
    return (
        <div>
            <p className="legend">
                <svg height="1" width="20">
                    <line
                        x1="0"
                        y1="0"
                        x2="50"
                        y2="0"
                        stroke={red}
                        strokeWidth="2"
                    />
                </svg>
                &nbsp;simulation above threshold
            </p>
            <p className="legend">
                <svg height="1" width="21">
                    <line
                        x1="0"
                        y1="0"
                        x2="50"
                        y2="0"
                        stroke={green}
                        strokeWidth="2"
                    />
                </svg>
                &nbsp;simulation below threshold
            </p>
        </div>
        )
    }
}

export default Legend