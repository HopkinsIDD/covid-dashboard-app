import React, { Component } from 'react';
import { Select } from 'antd';
import { COUNTIES } from '../../utils/geoids.js';


class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            countyName: '',
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const { Option } = Select;

        for (const [key, value] of Object.entries(COUNTIES)) {
            const child = {
                key: `${key}-county`,
                button: []
            } 
            child.button.push(
                <Option
                    key={`${key}-county`}
                    value={key}>
                    {value}
                </Option>
            )
            children.push(child);
        }
        this.setState({children})
    }

    handleCountySelect = (event) => {
        this.props.onCountySelect(event);
        this.setState({countyName: COUNTIES[event]})
    }

    render() {
        return (
            <Select
                showSearch
                placeholder="Search for your state or county"
                optionFilterProp="children"
                style={this.props.style}
                size={this.props.size}
                onChange={this.handleCountySelect}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {this.state.children.map(county => county.button)}
            </Select>
        )
    }
}

export default SearchBar;
