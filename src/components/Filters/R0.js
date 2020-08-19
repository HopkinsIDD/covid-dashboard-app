import React, { Component } from 'react';
import TooltipHandler from '../Filters/TooltipHandler';
import Histogram from '../Filters/Histogram';
import { min, max, range } from 'd3-array';
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

    componentDidMount() {
        const { allSims } = this.props;
        const sorted_sims = allSims.slice().sort((a,b) => a.r0 - b.r0)
        const r0min = min(sorted_sims, d => d.r0)
        const r0max = max(sorted_sims, d => d.r0)
        const step = (r0max - r0min) / 10
        this.setState({ step, sortedSims: sorted_sims, r0min, r0max })
    }
    
    handleChange = (r0new) => {
        const { step } = this.state;
        const { r0selected, onR0Change } = this.props;

        // prevent user from selecting no range
        const range = r0new[1] - r0new[0] < step ? r0selected : r0new;
        onR0Change(range);
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
        const { r0full, r0selected, allSims, selectedSims, onR0Resample } = this.props;
        const { step, sortedSims, r0min, r0max } = this.state;
        const minR0 = r0full[0], maxR0 = r0full[1];
        const activeMin = r0selected[0].toFixed(1), activeMax = r0selected[1].toFixed(1);
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
                <div className="map-wrapper">
                    <div className="r0-histogram">
                        <Histogram
                            allSims={allSims}
                            selectedSims={selectedSims}
                            sortedSims={sortedSims}
                            selected={r0selected}
                            r0min={r0min}
                            r0max={r0max}
                            height={25}
                            step={step}
                        />
                    </div>
                    <div className="filter-label">
                        <span className='callout r0-range'>
                            [{activeMin}-{activeMax}]
                        </span>
                    </div>
                </div>
                <div className="map-wrapper">
                    <div className="r0-slider" id="r0Slider">
                        <Slider
                            range
                            marks={this.showMarks(minR0, maxR0)}
                            min={minR0}
                            max={maxR0} 
                            step={step}
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
                            onClick={onR0Resample}>resample
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default R0
