import React, { Component } from 'react';
import _ from 'lodash';
import { LEVELS } from '../../utils/constants.js';

class Severity extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         levels: Array.from(LEVELS),
    //     }
    // }

    componentDidMount() {
        console.log('severity componentDidMount LEVELS', LEVELS)
    }

    handleChange = (item) => {
        // add scenario to severity obj so MainContainer knows which scenario is activated
        // console.log('severityContainer this.state.levels',this.state.levels)
        console.log('LEVELS', LEVELS) 

        const itemClone = _.assign({}, item, {
            scenario: this.props.scenario.key
        });
        // const itemCopy = _.cloneDeep(item);

        // itemCopy.scenario = this.props.scenario.key; // i think this line is the problem

        console.log('in severity', itemClone)
        this.props.onSeverityClick(itemClone);
    }

    render() {
        // const { severity } = this.props;
        // console.log('sev render', this.state.levels)
        const levelsCopy = _.cloneDeep(LEVELS);
        return ( 
            <div>
                {levelsCopy.map(level => {
                    /* console.log(this.props.scenario, level.key, level.key===severity.key) */
                    /* const isActive = (level.key === severity.key) ? 'checked' : ''; */
                    return (
                        <div className="form-check" key={level.id}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="sev"
                                onChange={() => this.handleChange(_.cloneDeep(level))} 
                                // checked={isActive}

                                />
                            <label className="form-check-label filter-label">
                            {level.name}
                            </label>
                        </div>
                    )
                })}
            </div>
            
        )
    }
}

export default Severity