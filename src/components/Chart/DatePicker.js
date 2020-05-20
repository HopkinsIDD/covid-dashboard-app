import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

class Chart extends Component {
    // TODO: ensure end date is always after start date
    // only allow Sundays to be selected 
    
    handleStartDate = (date) => {
        this.props.onHandleSummaryStart(date);
    };

    handleEndDate = (date) => {
        this.props.onHandleSummaryEnd(date);
    };
    
      render() {
        return (
            <div>
                <div className="row filter-label">
                    <DatePicker
                        className="date-picker"
                        selected={this.props.summaryStart}
                        onChange={date => this.handleStartDate(date)}
                    />
                    <p>&nbsp;to&nbsp;</p>
                    <DatePicker
                        className="date-picker"
                        selected={this.props.summaryEnd}
                        onChange={date => this.handleEndDate(date)}
                    />
                </div>
            </div>
        );
    }
}

export default Chart 