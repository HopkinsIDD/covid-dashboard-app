import React, { Component } from 'react';
import { DatePicker } from 'antd';
import { styles } from '../../utils/constants';
import TooltipHandler from '../Filters/TooltipHandler';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false
        }
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    handleChange = (dates) => {

        let start;
        let end;
        if (dates) {
            start = dates[0]._d;
            end = dates[1]._d;
        } else {
            start = new Date();
            end = new Date();
            end.setDate(end.getDate() - 14);
        }

        this.props.onHandleSummaryDates(start, end);
    }

    disabledDate = (dateMoment) => {
        // prevent user from selecting beyond modeled date range
        const date = dateMoment._d;
        return date < this.props.firstDate || date > this.props.lastDate;
    }

    handleOpen = (datePickerOpen) => {
        this.props.onHandleDatePicker(datePickerOpen)
    }
    
    render() {
        const { RangePicker } = DatePicker;
        // defautValue for DatePicker might be buggy.
        // these values console out with the right defaults here
        // but both render as the value for summaryEnd in the DatePicker
        return (
            <div>
                <div className="param-header">DATE RANGE
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                            Choose a date range across which to calculate and display aggregate statistics. 
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <RangePicker
                    disabledDate={this.disabledDate} 
                    style={styles.Selector}
                    // renderExtraFooter={() => "Select a summary period in weekly increments"}
                    onChange={this.handleChange}
                    onOpenChange={this.handleOpen}
                />
            </div>
        );
    }
}

export default Chart 
