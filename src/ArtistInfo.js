import React, { Component } from 'react';

class ArtistInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: this.props.value
    }
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onArtistClick(this.state.idx);
  }

  render() {
    return (
      <span className="clickable" onClick={this.onClick}>{this.props.artist.name}</span>
    )
  }
}

export default ArtistInfo;
