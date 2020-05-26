import React from 'react';
import { green, red } from '../../utils/constants';

function Legend(props) {
    if (!props.showConfBounds) {
        return (
            <g className="legend-container">
                <g className="legend">
                    <g className="legend-above" >
                        <line
                            x1={props.x}
                            y1={props.y}
                            x2={props.x + 20}
                            y2={props.y}
                            stroke={red}
                            strokeWidth="1"
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                            simulation above threshold
                        </text>
                    </g>
                </g>
                <g className="legend">
                    <g className="legend-below">
                        <line
                            x1={props.x}
                            y1={props.y + 20}
                            x2={props.x + 20}
                            y2={props.y + 20}
                            stroke={green}
                            strokeWidth="1"
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 20 + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                            simulation below threshold
                        </text>
                    </g>
                </g>
            </g>
        )     
    } else {
        return (
            <g className="legend-container">
                <g className="legend">
                    <g className="legend-mean">
                        <line
                            x1={props.x}
                            y1={props.y}
                            x2={props.x + 20}
                            y2={props.y}
                            stroke="#4ddaba"
                            strokeWidth="2"
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                            mean
                        </text>
                    </g>
                </g>
                <g className="legend">
                    <g className="legend-confBounds">
                        <rect
                            x={props.x}
                            y={props.y + 20}
                            width={20} 
                            height={10}
                            fill="#4ddaba"
                            fillOpacity={0.3}
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 20 + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                        10%-90% confidence bounds
                        </text>
                    </g>
                    
                </g>
                <g className="legend">
                    <g className="legend-sims">
                        <line
                            x1={props.x}
                            y1={props.y + 40}
                            x2={props.x + 20}
                            y2={props.y + 40}
                            stroke="#d0d0d0"
                            strokeWidth="1"
                        />
                        <text 
                            x={props.x + 25}
                            y={props.y + 40 + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                        simulation curves
                        </text>
                    </g>
                </g>
            </g>
        )
    }
}

export default Legend