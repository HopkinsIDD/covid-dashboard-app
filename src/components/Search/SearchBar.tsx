import React, { Component } from 'react';
import { Select } from 'antd';
import { COUNTIES } from '../../utils/geoids';
import * as CSS from 'csstype';


type Child = {
    key: string,
    button: Array<any>, // FIXME any should be of type Option Component
}

interface Props {
    onCountySelect: (county: string) => void,
    style: CSS.Properties,
}

interface State {
    fileName: string,
    countyName: string,
    children: Array<Child>
}


class SearchBar extends Component<Props, State> {
    constructor(props: Props) {
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
            const child: Child = {
                key: `${key}-county`,
                button: []
            };
            child.button.push(
                <Option
                    key={`${key}-county`}
                    value={key}>
                    {value}
                </Option>
            );
            children.push(child);
        }
        this.setState({ children })
    }

    handleCountySelect = (geoid: string) => {
        this.props.onCountySelect(geoid);
        // TODO: Element implicitly has an 'any' type because expression of type 
        // 'string' can't be used to index type '{ "01001": string; ...
        this.setState({countyName: COUNTIES[geoid]})
    };


    render() {
        return (
            <Select
                showSearch
                placeholder="Search for your county"
                optionFilterProp="children"
                style={this.props.style}
                size={"large"}
                onChange={this.handleCountySelect}
                filterOption={(input, option) =>
                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {this.state.children.map(county => county.button)}
            </Select>
        )
    }
}

export default SearchBar;
