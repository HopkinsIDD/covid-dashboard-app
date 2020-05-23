import React from 'react';
import { green, red } from '../../utils/constants';

function Legend(props) {
    if (!props.showConfBounds) {
        return (
            <div className="legend-container">
                <p className="legend">
                    <svg height="4" width="20">
                        <line
                            x1="0" y1="0" x2="50" y2="0"
                            stroke={red}
                            strokeWidth="2"
                        />
                    </svg>
                    &nbsp;simulation above threshold
                </p>
                <p className="legend">
                    <svg height="4" width="20">
                        <line
                            x1="0" y1="0" x2="50" y2="0"
                            stroke={green}
                            strokeWidth="2"
                        />
                    </svg>
                    &nbsp;simulation below threshold
                </p>
            </div>
        )     
    } else {
        return (
            <div className="legend-container">
                <p className="legend">
                    <svg height="2" width="20">
                        <line
                            x1="0" y1="0" x2="50" y2="0"
                            stroke="#4ddaba"
                            strokeWidth="4"
                        />
                    </svg>
                    &nbsp;mean
                </p>
                <p className="legend">
                    <svg height="10" width="20">
                        <rect
                            width="50" height="20"
                            fill="#4ddaba"
                            fillOpacity="0.3"
                        />
                    </svg>
                    &nbsp;10%-90% confidence bounds
                </p>
                <p className="legend">
                    <svg height="1" width="20">
                        <line
                            x1="0" y1="0" x2="50" y2="0"
                            stroke="#d0d0d0"
                            strokeWidth="2"
                        />
                    </svg>
                    &nbsp;simulation curves
                </p>
            </div>
        )
    }
}

export default Legend