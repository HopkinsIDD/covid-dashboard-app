import React, { Component } from 'react'

class Brush extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  render() {
    return (
      <div className='brush-wrapper'>
        <svg width={this.state.width} height={this.state.height}>
        </svg>
      </div>
    )
  }
}

export default Brush;