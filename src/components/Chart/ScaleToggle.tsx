import React, { Component } from 'react';
import { Radio } from 'antd';
import { styles } from '../../utils/constants';
import { RadioChangeEvent } from "antd/lib/radio";
import TooltipHandler from '../Filters/TooltipHandler';

export enum ScaleTypeEnum {
    linear = 'linear',
    power = 'power'
}

export type ScaleType = ScaleTypeEnum.linear | ScaleTypeEnum.power

interface Props {
    scale: ScaleType,
    onScaleToggle: (scale: any) => void,
}

interface State {
    showTooltip: boolean
}

class ScaleToggle extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showTooltip: false
        }
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    handleChange = (e: RadioChangeEvent) => {
        this.props.onScaleToggle(e.target.value);
    };

    render() {
        return (
            <div>
                <div className="param-header">Y-AXIS SCALE
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                            Toggle between a linear scale or a power scale, 
                            which reveals more granularity at lower levels.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <Radio.Group
                    value={this.props.scale}
                    style={styles.Selector}
                    onChange={this.handleChange}>
                    <Radio.Button value={ScaleTypeEnum.linear}>Linear</Radio.Button>
                    <Radio.Button value={ScaleTypeEnum.power}>Power</Radio.Button>
                </Radio.Group>
            </div>
        )
    }
}

export default ScaleToggle
