import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import { Slider } from 'antd';
import { styles } from '../../utils/constants';


class R0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false,
            step: 0.2
        }
    }
    
    handleChange = (e) => {
        const { r0selected } = this.props;
        let min, max;
        // TODO: CLEAN THIS UP --> 
        // if r0 range is increased
        if (e[1] > r0selected[1]) {
            min = Math.round((e[1] - 0.2) * 10) / 10;
            max = Math.round(e[1] * 10) / 10;
        // if r0 range is decreased
        } else if (e[0] < r0selected[0]) {
            min = Math.round(e[0] * 10) / 10;
            max = Math.round((e[0] + 0.2) * 10) / 10;
        // prevent user from selecting beyond range
        } else {
            min = r0selected[0];
            max = r0selected[1];
        }

        this.props.onR0Change([min, max])
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    showMarks(min, max) {
        return {
            [min]: {style: styles.Marks, label: [min]}, 
            [max]: {style: styles.Marks, label: [max]}
        }
    }
 
    render() {
        const { r0full, r0selected } = this.props;
        const min = r0full[0], max = r0full[1];
        const activeMin = r0selected[0], activeMax = r0selected[1];
        return (
            <div>
                <div className="param-header">REPRODUCTION NUMBER 
                    <TooltipHandler
                        showTooltip={this.state.showTooltip}
                        onClick={this.handleTooltipClick}
                        >
                        <div className="tooltip">&nbsp;&#9432;
                            {this.state.showTooltip ?
                            <span className="tooltip-text">
                                The reproduction number, or R<sub>0</sub>, indicates
                                the intensity of an infection and describes the
                                expected number of people directly infected by
                                one person. For example, a person with an infection
                                having an R<sub>0</sub> of 4 will transmit it to an
                                average of 4 other people.              
                            </span> 
                            : null}
                        </div>
                    </TooltipHandler>
                </div>
                <div className="filter-label">
                    <span className='callout'>
                        R<sub>0</sub> between {activeMin} - {activeMax}
                    </span>
                </div>
                <Slider
                    style={styles.Selector}
                    range
                    marks={this.showMarks(min, max)}
                    min={min}
                    max={max} 
                    step={this.state.step}
                    included={true}
                    tooltipVisible={false}
                    defaultValue={r0selected}
                    value={r0selected}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default R0
