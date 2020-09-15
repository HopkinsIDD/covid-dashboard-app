import React, { Component } from 'react';
import { Select } from 'antd';
import { GEOIDS } from '../../utils/geoids';
import { SelectValue } from "antd/lib/select";
import * as CSS from 'csstype';

type Child = {
    key: string,
    button: Array<any>, // FIXME any should be of type Option Component
}

interface Props {
    onCountySelect: (county: SelectValue) => void,
    style: CSS.Properties,
}

interface State {
    fileName: string,
    geoidName: string,
    children: Array<Child>
}


class SearchBar extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            fileName: '',
            geoidName: '',
            children: []
        }
    }

    componentDidMount() {
        const children = [];
        const { Option } = Select;

        for (const [key, value] of Object.entries(GEOIDS).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))) {
            const child = {
                key: `${key}-county`,
                button: []
            };
            child.button.push(
                // @ts-ignore
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

    handleCountySelect = (event: SelectValue) => {
        this.props.onCountySelect(event);
        if (typeof event === 'string') {
            this.setState({ geoidName: GEOIDS[event] })
        } else {
            console.log(`handleCountySelect(): unexpected event=${event.toString()}`)
        }
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
