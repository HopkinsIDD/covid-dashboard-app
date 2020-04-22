import React, { Component } from 'react';
import { STATS } from '../../store/constants.js';

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(i) {
        this.props.onButtonClick(i.name);
    }

    render() {
        return (
            STATS.map(stat => {
                return (
                    <button
                        type="button"
                        className="btn btn-light btn-stat"
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