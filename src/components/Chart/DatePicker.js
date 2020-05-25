import React, { Component } from 'react';
import { DatePicker } from 'antd';

class Chart extends Component {
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
        const date = dateMoment._d;
        return (
            date < this.props.firstDate || 
            date > this.props.lastDate ||
            date.getDay() > 0
            );
    }

    handleOpen = (datePickerOpen) => {
        console.log('datePickerOpen', datePickerOpen)
        this.props.onHandleDatePicker(datePickerOpen)
    }
    
    render() {
        const { RangePicker } = DatePicker;
        return (
            <div>
                <div className="param-header">DATE RANGE</div>
                <RangePicker
                    disabledDate={this.disabledDate} 
                    onChange={this.handleChange}
                    onOpenChange={this.handleOpen}
                />
            </div>
        );
    }
}

export default Chart 
