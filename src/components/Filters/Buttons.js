import React, { Component } from 'react';
import { STATS } from '../../utils/constants.js';

class Buttons extends Component {
    handleClick = (i) => {
        this.props.onButtonClick(i);
    }

    render() {
        return (
            STATS.map(stat => {
                const isActive = (stat.key === this.props.stat.key) ? ' btn-active' : '';
                return (
                    <button
                        type="button"
                        className={"btn btn-light btn-stat filter-label" + isActive}
                        onClick={() => this.handleClick(stat)}
                        key={stat.id}>
                        {stat.name}
                    </button>
                )
            })
        )
    }
}

export default Buttons