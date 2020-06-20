import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import Histogram from '../Filters/Histogram';
import { Button, Slider } from 'antd';
import { styles } from '../../utils/constants';


class R0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false,
            step: 0.1 
        }
    }
    
    handleChange = (e) => {
        // prevent user from selecting no range
        if (e[1] - e[0] < this.state.step) return
        this.props.onR0Change(e);
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
        const { r0full, r0selected, allSims, selectedSims } = this.props;
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
                            {this.state.showTooltip &&
                            <span className="tooltip-text">
                                The reproduction number, or R<sub>0</sub>, indicates
                                the intensity of an infection and describes the
                                expected number of people directly infected by
                                one person. For example, a person with an infection
                                having an R<sub>0</sub> of 4 will transmit it to an
                                average of 4 other people. <br /><br />
                                The displayed simulation curves are only a sample of the
                                total simulation curves within the selected R<sub>0</sub>&nbsp;
                                range. Click the <b>resample</b> button to display 
                                a different sample set of simulation curves.         
                            </span> }
                        </div>
                    </TooltipHandler>
                </div>
                <div className="filter-label">
                    <span className='callout'>
                            R<sub>0</sub> between {activeMin} - {activeMax}
                    </span>
                </div>
                <div className="r0-histogram">
                        <Histogram
                            allSims={allSims}
                            selectedSims={selectedSims}
                            selected={r0selected}
                            height={30}
                        />
                    </div>
                <div className="map-wrapper">
                    <div className="r0-slider" id="r0Slider">
                        <Slider
                            range
                            marks={this.showMarks(min, max)}
                            min={min}
                            max={max} 
                            step={this.state.step}
                            included={true}
                            tooltipVisible={false}
                            defaultValue={r0selected}
                            value={r0selected}
                            onChange={this.handleChange} />
                    </div>
                    <div className="resample">
                        <Button 
                            type="dashed" 
                            size="small"
                            onClick={this.props.onR0Resample}>resample
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default R0
