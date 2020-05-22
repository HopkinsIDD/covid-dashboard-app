import React, { Component } from 'react';
import { capitalize } from '../../utils/utils';
const scales = ['power', 'linear'];

class ScaleToggle extends Component {
  handleChange = (item) => {
    this.props.onScaleToggle(item);
  }

  render() {
    const { scale } = this.props;
    return ( 
      <div>
          {scales.map(scl => {
              const isActive = (scale === scl) ? 'checked' : '';
              return (
                  <div
                      className="form-check"
                      key={scl}>
                      <input
                          className="form-check-input"
                          type="radio"
                          name={`${scl}-scale`}
                          id={`${scl}-scale`}
                          onChange={() => this.handleChange(scl)} 
                          checked={isActive}
                          />
                      <label
                          className="form-check-label filter-label"
                          htmlFor={`${scl}-scale`}>
                          {`${capitalize(scl)} Scale`}
                      </label>
                  </div>
              )
          })}
      </div>  
    )
  }
}

export default ScaleToggle