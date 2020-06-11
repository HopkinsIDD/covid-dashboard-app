import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class OutsideAlerter extends Component {
    // Component facilitates click handler of tooltip and ensures it closes
    // when user clicks anywhere on the page after opening tooltip

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onClick = this.props.onClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClick(event) {
        const { showTooltip } = this.props;

        if (this.wrapperRef && 
            this.wrapperRef.contains(event.target)) {
            // click on tooltip
            this.onClick();
        } else if (
            this.wrapperRef && 
            !this.wrapperRef.contains(event.target) &&
            showTooltip === true) {
            // click outside tooltip will close menu
            this.onClick();
        } else {
            return;
        }
    }

    render() {
        return (
        <div style={{ display: 'inline' }} ref={this.setWrapperRef}>
            {this.props.children}
        </div> 
        );
    }
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
};