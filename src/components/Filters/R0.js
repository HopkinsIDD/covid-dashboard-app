import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import { Slider } from 'antd';
import { styles } from '../../utils/constants';


class R0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false
        }
    }
    
    handleChange = (e) => {
        // prevent user from selecting no range
        if (e[1] - e[0] < 1) {return;}
        this.props.onR0Change(e);
    }

    handleTooltipClick = () => {
        this.setState({showTooltip: !this.state.showTooltip})
    }

    render() {
        const { r0 } = this.props;
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
                    <span className='callout'>R<sub>0</sub> between {r0[0]} - {r0[1]}</span>
                </div>
                <Slider
                    style={{ width: '80%' }}
                    range
                    marks={styles.MarksR0}
                    min={0}
                    max={4} 
                    step={0.5}
                    included={true}
                    tooltipVisible={false}
                    defaultValue={r0}
                    value={r0}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default R0
