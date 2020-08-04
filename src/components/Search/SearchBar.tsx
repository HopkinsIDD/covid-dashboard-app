import React, { Component } from 'react';
import { Select } from 'antd';
import { COUNTIES } from '../../utils/geoids';
import { SelectValue } from "antd/lib/select";
import { County } from "../../utils/constantsTypes";
import * as CSS from 'csstype';


type Child = {
    key: string,
    button: Array<any>, // FIXME any should be of type Option Component
}

interface Props {
    onCountySelect: (county: County) => void,
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

        for (let county of COUNTIES) {
            const child: Child = {
                key: `${county.geoid}-county`,
                button: []
            };
            const label = county.geoid.length === 2 ? county.name :
                `${county.name}, ${county.usps}`;

            child.button.push(
                <Option
                    key={`${county.geoid}-county`}
                    value={county.geoid}
                >
                    {label}
                </Option>
            );
            children.push(child);
        }
        this.setState({ children })
    }

    handleCountySelect = (event: SelectValue) => {
        console.log('county select');

        const county: County = COUNTIES.filter(county => county.geoid === event)[0];

        this.props.onCountySelect(county);
        this.setState({
            countyName: `${county.name}, ${county.usps}`
        })
    };

    render() {
        return (
            <Select
                showSearch
                placeholder="Search for your state or county"
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
