import React from 'react';
import { green, red, gray } from '../../utils/constants';

function ChartLegend(props) {
   
        return (
            <div className="legend-container chart-legend-boxplot">
                <p className="legend" style={{ marginRight: 0 }}>
                    <svg width="20" height="55">
                        <rect 
                            x="0" y="20" width="20" height="35"
                            fill={green}
                            opacity={0.8}
                        />
                        <line
                            x1="5" y1="1" x2="15" y2="1"
                            stroke={gray}
                            strokeWidth="1"
                        />
                        <line
                            x1="10" y1="0" x2="10" y2="40"
                            stroke={gray}
                            strokeWidth="1"
                        />
                        <line
                            x1="5" y1="40" x2="15" y2="40"
                            stroke={gray}
                            strokeWidth="1"
                        />
                    </svg>
                </p>
                <p className="legend" style={{ marginRight: 4 }}>
                    <svg width="20" height="55">
                        <line
                            x1="4" y1="1" x2="20" y2="1"
                            stroke={gray}
                            strokeWidth="1"
                            opacity={0.5}
                            strokeDasharray="4 2"
                        />
                        <line
                            x1="4" y1="20" x2="20" y2="20"
                            stroke={gray}
                            strokeWidth="1"
                            opacity={0.5}
                            strokeDasharray="4 2"
                        />
                        <line
                            x1="4" y1="40" x2="20" y2="40"
                            stroke={gray}
                            strokeWidth="1"
                            opacity={0.5}
                            strokeDasharray="4 2"
                        />
                    </svg>
                </p>
                <p>
                <svg width="200" height="55">
                    <text
                        x="0"
                        y="10"
                        opacity={0.65}
                        className="titleNarrow"
                    >
                    90th percentile
                    </text>
                    <text
                        x="0"
                        y="27"
                        opacity={0.65}
                        className="titleNarrow"
                    >
                    median
                    </text>
                    <text
                        x="0"
                        y="45"
                        opacity={0.65}
                        className="titleNarrow"
                    >
                    10th percentile
                    </text>
                </svg>
                </p>
            </div>
        )
}

export default ChartLegend