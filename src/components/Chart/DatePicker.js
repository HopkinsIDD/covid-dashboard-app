import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStart: new Date('2020-01-31'),
        }
    };

    componentDidMount() {
        this.setState({
            selectedStart: this.props.firstDate,
        })
    };

    handleStartDate = (date) => {
        this.props.onHandleSummaryStart(date);
        this.setState({
            selectedStart: date,
        })    
    };

    handleEndDate = (date) => {
        this.props.onHandleSummaryEnd(date);
    };

    isSunday = (date) => {
        return date.getDay() === 0;
    };
    
    render() {
        return (
            <div>
                <div className="filter-label">
                    <div className="row">
                        <p className="date-label">START</p>
                        <DatePicker
                            className="date-picker"
                            selected={this.props.summaryStart}
                            minDate={this.props.firstDate}
                            maxDate={this.props.lastDate}
                            filterDate={this.isSunday}
                            onChange={date => this.handleStartDate(date)}
                        />
                    </div>
                    <div className="row">
                        <p className="date-label">END</p>
                        <DatePicker
                            className="date-picker"
                            selected={this.props.summaryEnd}
                            minDate={this.state.selectedStart}
                            maxDate={this.props.lastDate}
                            filterDate={this.isSunday}
                            onChange={date => this.handleEndDate(date)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Chart 