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

        for (let county of COUNTIES) {
            const child = {
                key: `${county.geoid}-county`,
                button: []
            } 
            const label = county.geoid.length === 2 ? county.name :
                `${county.name}, ${county.usps}`;

            child.button.push(
                <Option
                    key={`${county.geoid}-county`}
                    value={county.geoid}>
                    {label}
                </Option>
            )
            children.push(child);
        }
        this.setState({children})
    }

    handleCountySelect = (event) => {
        console.log('county select')

        const item = COUNTIES.filter(county => county.geoid === event)[0];

        this.props.onCountySelect(item);
        this.setState({
            countyName: `${item.name}, ${item.usps}`
        })
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
