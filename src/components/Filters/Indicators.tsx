import React, { Component } from 'react';
import { Select } from 'antd';
import { styles } from '../../utils/constants';
import { SelectValue } from "antd/lib/select";
import { Indicator } from "../../utils/constantsTypes";


interface Child {
    key: string,
    button: Array<any>
}

interface Props {
    onIndicatorClick: (indicator: Indicator) => void,
    indicators: Array<Indicator>,
    indicator: Indicator,
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

        for (let indicator of this.props.indicators) {
            const child: Child = {
                key: `${indicator.key}-indicator`,
                button: []
            };
            child.button.push(
                <Option
                    key={`${indicator.key}-indicator`}
                    value={indicator.key}>{indicator.name}
                </Option>
            );
            children.push(child);
        }

        this.setState({children})
    }

    handleChange = (e: SelectValue) => {
        const item = this.props.indicators.filter(indicator => indicator.key === e)[0];
        this.props.onIndicatorClick(item);
    }

    render() {
        const {indicator} = this.props;
        return (
            <div>
                <div className="param-header">INDICATOR</div>
                <Select
                    // re-render every time indicator key changes
                    key={indicator.key}
                    defaultValue={indicator.key}
                    style={styles.Selector}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.button)}
                </Select>
            </div>
        )
    }
}

export default Indicators
