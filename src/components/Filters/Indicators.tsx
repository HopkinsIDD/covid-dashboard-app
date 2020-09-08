import React, { Component } from 'react';
import { Select } from 'antd';
import { styles } from '../../utils/constants';
import { SelectValue } from "antd/lib/select";
import { Indicator } from "../../utils/constantsTypes";
import TooltipHandler from './TooltipHandler';


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
    children: Array<Child>,
    showTooltip: boolean
}

class Indicators extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            children: [],
            showTooltip: false
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

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    handleChange = (e: SelectValue) => {
        const item = this.props.indicators.filter(indicator => indicator.key === e)[0];
        this.props.onIndicatorClick(item);
    }

    render() {
        const {indicator} = this.props;
        return (
            <div>
                <div className="param-header">INDICATOR    
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                                Indicators are calculated after accounting for the 
                                appropriate time delays and probabilities of 
                                transitioning into a given state 
                                (e.g., initial infection to hospitalization).
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
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
