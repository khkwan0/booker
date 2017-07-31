import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';

class UploadImage extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUploadClick = this.handleImageUploadClick.bind(this);
  }

  handleImageUploadClick() {
    this.inputElement.click();
  }

  handleChange(e) {
    if (e.target.value) {
      let data = new FormData();
      let files = this.inputElement.files;

      data.append('file', files[0]);
      fetch(Config.default.host+'/imageupload',
        {
          method: 'POST',
          body: data,
          credentials: 'include'
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        this.props.postUpload(resultJson.filename, resultJson.th, resultJson.orig);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  render() {
    return (
      <div style={{textAlign:'left'}}>
        <RB.Label onClick={this.handleImageUploadClick} className="clickable" bsStyle="primary">Upload</RB.Label> an image.  (You can add more images later)
        <input ref={input => this.inputElement = input} className="hiddenFileDialog" type="file" onChange={this.handleChange} />
      </div>
    )
  }
}

export default UploadImage;
