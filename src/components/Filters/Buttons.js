import React, { Component } from 'react';
import { Select } from 'antd';
import { STATS } from '../../utils/constants.js';

class Buttons extends Component {
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
            const child = {
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
        this.props.onButtonClick(item);
    }

    render() {
        const { stat } = this.props;
        return (
            <div>
                <div className="param-header">INDICATOR</div>
                <Select
                    defaultValue={stat.key}
                    style={{ width: 120 }}
                    onChange={this.handleChange}>
                    {this.state.children.map(child => child.button)}
                </Select>
            </div>
        )
    }
}

export default Buttons
