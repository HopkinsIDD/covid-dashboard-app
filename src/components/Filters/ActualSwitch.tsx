import React, { Component } from 'react';
import { Row, Switch } from 'antd';
import TooltipHandler from './TooltipHandler';
import { styles } from '../../utils/constants';

// TODO: use this interface in utils.js file for TS migration
interface ActualObj {
    date: Date,
    val: number
}

interface Props {
    actualList: Array<Array<ActualObj>>, 
    onChange: () => void,
}

interface State {
    showTooltip: boolean,
}

class ActualSwitch extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showTooltip: false
        }
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    render() {
        const { actualList } = this.props;
        const isDisabled = actualList[0].length === 0 ? true : false;
        return (
            <Row gutter={styles.gutter} style={styles.Switch}>
                <Switch
                    style={{ 'marginTop': '0.1rem' }}
                    onChange={this.props.onChange}
                    disabled={isDisabled}
                    size="small"/>
                <div className="upload-toggle">ACTUAL DATA
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                                Currently, actual data is only 
                                available for the <i>death</i> indicator.
                                Source: USA Facts.
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
            </Row> 
        )
    }
}

export default ActualSwitch