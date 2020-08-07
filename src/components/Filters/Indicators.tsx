import React, { Component } from 'react';
import { Select } from 'antd';
import { styles } from '../../utils/constants';
import { SelectValue } from "antd/lib/select";
import { Stat } from "../../utils/constantsTypes";


interface Child {
    key: string,
    button: Array<any>
}

interface OutcomeObj {
    id: number,
    key: string,
    name: string,
    disabled: boolean
}

interface Props {
    onIndicatorClick: (stat: Stat) => void,
    STATS: Array<OutcomeObj>, // TODO: update name stat vs outcome
    stat: Stat,
}

interface State {
    children: Array<Child>;
}

class Indicators extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const {Option} = Select;

        for (let stat of this.props.STATS) {
            const child: Child = {
                key: `${stat.key}-stat`,
                button: []
            };
            child.button.push(
                <Option
                    key={`${stat.key}-stat`}
                    value={stat.key}>{stat.name}
                </Option>
            );
            children.push(child);
        }

        this.setState({children})
    }

    handleChange = (e: SelectValue) => {
        const item = this.props.STATS.filter(stat => stat.key === e)[0];
        this.props.onIndicatorClick(item);
    }

    render() {
        const {stat} = this.props;
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
