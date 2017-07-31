import React, { Component } from 'react';
import spinner from './lp.png';

class Spinner extends Component {
  render() {
    return(
      <img src={spinner} className="spinner" alt="spinner" />
    )
  }
}

export default Spinner;
