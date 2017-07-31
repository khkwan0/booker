import React, { Component } from 'react';
import * as RB from 'react-bootstrap';

class CalendarButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refId: this.props.refId
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.state.refId);
  }

  render() {
    return(
      <RB.Label bsStyle="primary" onClick={this.handleClick} className="clickable">Edit Availability</RB.Label>
    )
  }
}

export default CalendarButton;
