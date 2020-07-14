// @flow

import React, { Component } from 'react';
import { Select } from 'antd';
import { type Stat, STATS, styles } from '../../utils/constants.js';

type Child = {
    key: string,
    button: Array<any>
}

type Props = {|
    onIndicatorClick: (stat: Stat) => void,
    stat: Stat,
|}

type State = {|
    children: Array<Child>;

|}

class Indicators extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const { Option } = Select;

        for (let stat of STATS) {
            const child: Child = {
                key: `${stat.key}-stat`,
                button: []
            }
            child.button.push(
                <Option
                    key={`${stat.key}-stat`}
                    value={stat.key}>{stat.name}
                </Option>
            )
            children.push(child);
        }

        this.setState({children})
    }

    handleChange = (e) => {
        const item = STATS.filter(stat => stat.key === e)[0];
        this.props.onIndicatorClick(item);
    }

    render() {
        const { stat } = this.props;
        return (
            <div>
                <div className="param-header">INDICATOR</div>
                <Select
                    defaultValue={stat.key}
                    style={styles.Selector}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.button)}
                </Select>
            </div>
        )
    }
}

export default Indicators
