// import React, { Component } from 'react';
// import { LEVELS } from '../../utils/constants.js';

// class Severity extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             levels: Array.from(LEVELS),
//         }
//     }

//     handleChange = (item) => {
//         // item.scenario = this.props.scenario.key; 
//         console.log('in severity', item)
//         this.props.onSeverityClick(item);
//     }

//     render() {
//         // const { severity } = this.props;
//         // console.log('sev render', this.state.levels)
//         return (
//             <div>
//                 {this.state.levels.map(level => {
//                     /* console.log(this.props.scenario, level.key, level.key===severity.key) */
//                     /* const isActive = (level.key === severity.key) ? 'checked' : ''; */
//                     return (
//                         <div className="form-check" key={level.id}>
//                             <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="sev"
//                                 onChange={() => this.handleChange(level)} 
//                                 // checked={isActive}

//                                 />
//                             <label className="form-check-label filter-label">
//                             {level.name}
//                             </label>
//                         </div>
//                     )
//                 })}
//             </div>
            
//         )
//     }
// }

// export default Severity