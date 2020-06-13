import React from 'react';
import colors from '../../utils/colors';

function Legend(props) {
    if (!props.showConfBounds && !props.showHoveredSim) {
        return (
            <g className="legend-container">
                <g className="legend">
                    <rect
                        x={props.x}
                        y={props.y}
                        width={160}
                        height={50}
                        fill={colors.graphBkgd}
                        fillOpacity={0.5}
                    />
                    <g className="legend-above" >
                        <line
                            x1={props.x}
                            y1={props.y}
                            x2={props.x + 20}
                            y2={props.y}
                            stroke={colors.red}
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
                            stroke={colors.green}
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
                {
                props.showActual &&
                    <g className="legend">
                        <g className="legend-actual">
                            <circle
                                cx={props.x + 18}
                                cy={props.y + 40}
                                fill={colors.orange}
                                r={2}
                            />
                            <text
                                x={props.x + 25}
                                y={props.y + 40 + 4}
                                opacity={0.65}
                                className="titleNarrow"
                            >
                                actual data points
                            </text>
                        </g>
                    </g>
                }
            </g>
        )     
    } else if (props.showConfBounds && !props.showHoveredSim) {
        return (
            <g className="legend-container">
                <g className="legend">
                    <rect
                        x={props.x}
                        y={props.y}
                        width={160}
                        height={50}
                        fill={colors.graphBkgd}
                        fillOpacity={0.5}
                    />
                    <g className="legend-mean">
                        <line
                            x1={props.x}
                            y1={props.y}
                            x2={props.x + 20}
                            y2={props.y}
                            stroke={colors.green}
                            strokeWidth="2"
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                            median
                        </text>
                    </g>
                </g>
                <g className="legend">
                    <g className="legend-confBounds">
                        <rect
                            x={props.x}
                            y={props.y + 15}
                            width={20} 
                            height={12}
                            fill={colors.green}
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
                            stroke={colors.lightGray}
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
                {
                props.showActual &&
                    <g className="legend">
                        <g className="legend-actual">
                            <circle
                                cx={props.x + 18}
                                cy={props.y + 60}
                                fill={colors.orange}
                                r={2}
                            />
                            <text
                                x={props.x + 25}
                                y={props.y + 60 + 4}
                                opacity={0.65}
                                className="titleNarrow"
                            >
                                actual data points
                            </text>
                        </g>
                    </g>
                }
            </g>
        )
    } else {
        console.log('here', props.showActual)
        return (
            <g className="legend-container">
                <g className="legend">
                    <rect
                        x={props.x}
                        y={props.y}
                        width={165}
                        height={50}
                        fill={colors.graphBkgd}
                        fillOpacity={0.5}
                    />
                    <g className="legend-above" >
                        <line
                            x1={props.x}
                            y1={props.y}
                            x2={props.x + 20}
                            y2={props.y}
                            stroke={colors.blue}
                            strokeWidth="1"
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                            highlighted simulation
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
                            stroke={colors.gray}
                            strokeWidth="1"
                        />
                        <text
                            x={props.x + 25}
                            y={props.y + 20 + 4}
                            opacity={0.65}
                            className="titleNarrow"
                        >
                            other simulations
                        </text>
                    </g>
                </g>
                {
                props.showActual &&
                    <g className="legend">
                        <g className="legend-actual">
                            <circle
                                cx={props.x + 18}
                                cy={props.y + 40}
                                fill={colors.orange}
                                r={2}
                            />
                            <text
                                x={props.x + 25}
                                y={props.y + 40 + 4}
                                opacity={0.65}
                                className="titleNarrow"
                            >
                                actual data points
                            </text>
                        </g>
                    </g>
                }
            </g>
        )     
    }
}

export default Legend

function ActualLegend(props) {
    return (
        <g className="legend">
            <g className="legend-actual">
                <circle
                    cx={props.x}
                    cy={props.y + 40}
                    fill={colors.orange}
                    r={3.5}
                />
                <text
                    x={props.x + 45}
                    y={props.y + 40 + 4}
                    opacity={0.65}
                    className="titleNarrow"
                >
                    actual data
                </text>
            </g>
        </g>
    )
}