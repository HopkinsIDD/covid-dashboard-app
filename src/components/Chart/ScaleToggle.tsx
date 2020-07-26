import React, { Component } from 'react';
import { Radio } from 'antd';
import { styles } from '../../utils/constants';
import { RadioChangeEvent } from "antd/lib/radio";

export enum ScaleTypeEnum {
    linear = 'linear',
    power = 'power'
}

export type ScaleType = ScaleTypeEnum.linear | ScaleTypeEnum.power

interface Props {
    scale: ScaleType,
    onScaleToggle: (scale: any) => void,
}


class ScaleToggle extends Component<Props> {

    handleChange = (e: RadioChangeEvent) => {
        this.props.onScaleToggle(e.target.value);
    };

    render() {
        return (
            <div>
                <div className="param-header">Y-AXIS SCALE</div>
                <Radio.Group
                    value={this.props.scale}
                    style={styles.Selector}
                    onChange={this.handleChange}>
                    <Radio.Button value={ScaleTypeEnum.linear}>Linear</Radio.Button>
                    <Radio.Button value={ScaleTypeEnum.power}>Power</Radio.Button>
                </Radio.Group>
                <div className="filter-description">
                    Toggle between a linear scale or a power scale,
                    which reveals more granularity at lower levels.
                </div>
            </div>
        )
    }
}

export default ScaleToggle
