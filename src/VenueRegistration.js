import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';
import UploadImage from './UploadImage';
import parseAddress from 'parse-address';

class VenueRegistration extends Component {
  constructor() {
    super();
    this.state = {
      venueName: '',
      address: '',
      parsed: {},
      location: {
        type: "Point",
        coordinates: []
      },
      address2: '',
      zip: '',
      cap: '',
      image: '',
      th: '',
      orig: '',
      desc: '',
      email: '',
      phone: '',
      webPage: '',
      showFullImage: false,
      userRegister: false,
      userLogin: false,
      incomplete: true
    };
    this.changeName = this.changeName.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.changeAddress2 = this.changeAddress2.bind(this);
    this.changeZip = this.changeZip.bind(this);
    this.changeCap = this.changeCap.bind(this);
    this.changeDesc = this.changeDesc.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeWebPage = this.changeWebPage.bind(this);
    this.receiveImage = this.receiveImage.bind(this);
    this.showFullImage = this.showFullImage.bind(this);
    this.hideFullImage = this.hideFullImage.bind(this);
    this.handleUserRegisterClick = this.handleUserRegisterClick.bind(this);
    this.handleUserLoginClick = this.handleUserLoginClick.bind(this);
    this.postRegister = this.postRegister.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.saveVenue = this.saveVenue.bind(this);
    this.checkComplete = this.checkComplete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userStatusClick === 'login') {
      this.setState({
        userLogin: true
      })
    }
    if (nextProps.userStatusClick === 'register') {
      this.setState({
        userRegister: true
      })
    }
  }

  checkComplete() {
    if (this.state.venueName &&
        this.state.address &&
        this.state.zip &&
        this.state.cap &&
        (this.state.email || this.state.phone)
    ) {
      this.atBottom.scrollIntoView({ behavior: "smooth" });
      this.setState({
        incomplete: false
      });
    } else {
      this.setState({
        incomplete: true
      });
    }
  }

  saveVenue() {
    if (!this.state.incomplete) {
      let toSave = {
        venueName: this.state.venueName,
        address: this.state.address,
        parsed: this.state.parsed,
        address2: this.state.address2,
        zip: this.state.zip,
        cap: this.state.cap,
        image: this.state.image,
        th: this.state.th,
        orig: this.state.orig,
        desc: this.state.desc,
        phone: this.state.phone,
        email: this.state.email,
        location: this.state.location
      };
      fetch(Config.default.host + '/savevenue',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(toSave)
        }
      )
      .then((result) => { return result.json() })
      .then(() => {
        this.props.updateUser('hasVenue', true);
        this.props.goManage();
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      this.setState({
        incomplete: true
      })
    }
  }

  changeName(e) {
    this.setState({
      venueName: e.target.value
    });
    this.checkComplete();
  }

  checkAddress(parsed) {
    let street = parsed.street;
    let number = parsed.number;
    let zip = this.state.zip;
    if (street && number && zip) {
      fetch(Config.default.host + '/getlonglat?st=' + street + '&nm=' + number + '&zip=' + zip,
        {
          method: 'GET',
          credentials: 'include'
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (resultJson) {
          let coords = [];
          coords.push(resultJson.lng);
          coords.push(resultJson.lat);
          this.setState({
            location: {
              type: "Point",
              coordinates: coords
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  changeAddress(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    let parsed = parseAddress.parseLocation(e.target.value);
    this.setState({
      address: e.target.value,
      parsed: parsed,
      typingTimeout: setTimeout(() => {this.checkAddress(parsed)}, 750)
    });
    this.checkComplete();
  }

  changeAddress2(e) {
    this.setState({
      address2: e.target.value
    });
    this.checkComplete();
  }

  changeZip(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      zip: e.target.value,
      typingTimeout: setTimeout(() => {this.checkAddress(this.state.parsed)}, 750)
    });
    this.checkComplete();
  }

  changeCap(e) {
    this.setState({
      cap: e.target.value
    });
    this.checkComplete();
  }

  changeDesc(e) {
    this.setState({
      desc: e.target.value
    });
    this.checkComplete();
  }

  changePhone(e) {
    this.setState({
      phone: e.target.value
    });
    this.checkComplete();
  }

  changeEmail(e) {
    this.setState({
      email: e.target.value
    });
    this.checkComplete();
  }

  changeWebPage(e) {
    this.setState({
      webPage: e.target.value
    });
    this.checkComplete();
  }

  receiveImage(url, th_url, orig) {
    this.setState({
      image: url,
      th: th_url,
      orig: orig,
      uploadImage:false
    });
    this.checkComplete();
  }

  showFullImage() {
    if (this.state.image) {
      this.setState({
        showFullImage: true
      });
    }
  }

  hideFullImage() {
    this.setState({
      showFullImage: false
    });
  }

  handleUserRegisterClick() {
    this.setState({
      userRegister: true
    });
  }

  handleUserLoginClick() {
    this.setState({
      userLogin: true
    });
  }

  postRegister(user) {
    this.props.handleUserRegister(user);
    this.setState({
      userRegister: false
    });
  }

  postLogin(user) {
    this.props.handleUserLogin(user);
    this.setState({
      userLogin: false
    });
  }

  render() {
    return (
      <div>
        {this.state.userRegister &&
          <div>
            {this.props.showRegister(this.postRegister)}
          </div>
        }
        {this.state.userLogin &&
          <div>
            {this.props.showLogin(this.postLogin)}
          </div>
        }
        {!this.state.userRegister && !this.state.userLogin &&
        <div>
          <div>
            <h2>Tell us about your venue</h2>
          </div>
          {!this.props.user && 
            <div>
              Already registered?  <RB.Label onClick={this.handleUserLoginClick} bsStyle="primary" className="clickable">Login</RB.Label>
            </div>
          }
          <RB.Row>
            <RB.Col md={4}></RB.Col>
            <RB.Col md={4}>
              <RB.FormGroup>
                <h3>What&apos;s the name of the venue?</h3>
                <RB.FormControl onChange={this.changeName} placeholder="Venue Name" type="text" value={this.state.venueName} />
                <h3>Where is it?</h3>
                <RB.FormControl onChange={this.changeAddress} placeholder="Address" type="text" value={this.state.address} />
                <RB.FormControl onChange={this.changeAddress2} placeholder="Address2 (optional)" type="text" value={this.state.address2} />
                <RB.FormControl onChange={this.changeZip} placeholder="ZIP code" type="text" value={this.state.zip} />
                {this.state.location.coordinates.length>0 &&
                  <div><span>{this.state.location.coordinates[1]}</span>,<span>{this.state.location.coordinates[0]}</span></div>
                }
                <h3>What is the maximum capacity?</h3>
                <RB.FormControl onChange={this.changeCap} placeholder="Capacity" type="text" value={this.state.cap} />
                <br />
                <UploadImage postUpload={this.receiveImage} />
                {this.state.image &&
                  <div>
                    <img onClick={this.showFullImage} src={Config.default.host + this.state.th} alt="venue_image" />
                  </div>
                }
                <RB.FormControl onChange={this.changeDesc} placeholder="Describe the venue...(optional)" componentClass="textarea" value={this.state.desc} />
                <h3>How can we contact you through email?</h3>
                <RB.FormControl onChange={this.changeEmail} placeholder="Contact Email" type="email" value={this.state.email} />
                <h3>How about through phone?</h3>
                <RB.FormControl onChange={this.changePhone} placeholder="Phone number"value={this.state.phone} />
                <h3>Do you have a web page for {this.state.venueName}?</h3>
                <RB.FormControl onChange={this.changeWebPage} placeholder="Web Page...(optional) "value={this.state.webPage} />
              </RB.FormGroup>
              <div>
                <div>
                  <h3><RB.Label className="clickable" bsStyle="warning" onClick={this.props.onCancel}>Cancel</RB.Label></h3>
                </div>
                {this.props.user && !this.state.incomplete &&
                  <div>
                    <h2><RB.Label className="clickable" bsStyle="primary" onClick={this.saveVenue}>Register the venue!</RB.Label></h2>
                  </div>
                }
                {!this.props.user &&
                  <div>
                    <div>You have to be a registered user in order to register a venue.</div>
                    <div>You can <RB.Label className="clickable" onClick={this.handleUserRegisterClick}>Register here</RB.Label></div>
                    <div>OR</div>
                    <div>If you already registered, you can <RB.Label className="clickable" bsStyle="primary" onClick={this.handleUserLoginClick}>Login</RB.Label> here</div>
                  </div>
                }
              </div>
            </RB.Col>
            <RB.Col md={4}>
              {this.state.incomplete &&
                <RB.Label bsStyle="warning">Form incomplete</RB.Label>
              }
              {!this.state.incomplete &&
                <RB.Label bsStyle="success">OK</RB.Label>
              }
            </RB.Col>
          </RB.Row>
          {this.state.showFullImage &&
            <div className="overlay">
              <div style={{textAlign: 'right'}}>
                <RB.Label className="clickable" bsStyle="danger" onClick={this.hideFullImage}>X</RB.Label>
              </div>
              <div>
                <img className="rounded" src={Config.default.host + this.state.image} alt="full_venue_image" />
              </div>
            </div>
          }
        </div>
        }
        <div style={{clear:'both'}} ref={(el) => {this.atBottom = el; }} />
      </div>
    )
  }
}

export default VenueRegistration;
