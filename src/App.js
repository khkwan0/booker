import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import { Calendar, CalendarControls } from 'react-yearly-calendar';
import logo from './logo.png';
import spinner from './lp.png';
import './App.css';
import Config from './config.js';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import parseAddress from 'parse-address';

class Spinner extends Component {
  render() {
    return(
      <img src={spinner} className="spinner" alt="spinner" />
    )
  }
}

class UserLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      pw: '',
      invalid: false,
      forgot: false,
      showSpinner: false
    }
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
  }

  handleCancel() {
    this.props.postLogin();
  }

  changeEmail(e) {
    this.setState({
      email: e.target.value,
      forgot: false
    });
  }

  changePassword(e) {
    this.setState({
      pw: e.target.value,
      forgot: false
    });
  }

  handleLogin() {
    if (this.state.email && this.state.pw) {
      this.setState({
        showSpinner: true
      })

      fetch(Config.default.host+'/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email:this.state.email, pw: this.state.pw})
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (resultJson.user) {
          this.props.postLogin(resultJson.user);
        } else {
          this.setState({
            invalid: true,
            showSpinner: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleForgotPassword() {
    this.setState({
      forgot: true
    });
  }

  render() {
    return(
      <div>
        <RB.Grid>
          <RB.Row>
            <RB.Col md={4}></RB.Col>
            <RB.Col md={4}>
              <RB.FormGroup>
                <h2>Login with the email and password you registered with...</h2>
                <h3>Email</h3>
                <RB.FormControl type="email" placeholder="email..." onChange={this.changeEmail} value={this.state.email} />
                <h3>Password</h3>
                <RB.FormControl type="password" placeholder="password..." onChange={this.changePassword} value={this.state.pw} />
                <div>
                  <h3><RB.Label className="clickable" onClick={this.handleCancel} bsStyle="warning">Cancel</RB.Label></h3>
                </div>
                <div>
                  {this.state.showSpinner &&
                    <Spinner />
                  }
                  {!this.state.showSpinner && 
                    <h3><RB.Label className="clickable" onClick={this.handleLogin} bsStyle="primary">Login</RB.Label></h3>
                  }
                </div>
                {this.state.invalid &&
                  <div>
                    <div>Invalid email or password</div>
                    <div>Did you <RB.Label className="clickable" bsStyle="warning" onClick={this.handleForgotPassword}>Forget</RB.Label> your password?</div>
                  </div>
                }
              </RB.FormGroup>
            </RB.Col>
            <RB.Col md={4}></RB.Col>
          </RB.Row>
        </RB.Grid>
      </div>
    );
  }
}

class UserRegister extends Component {
  constructor() {
    super();
    this.state = {
      uname: '',
      email: '',
      pw1: '',
      pw2: '',
      badPassword: false,
      tooShort: true ,
      badEmail: true,
      dupEmail: false,
      badUname: true,
      dupName: false,
      typingTimeout: 0
    }
    this.changeUsername = this.changeUsername.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordConfirm = this.changePasswordConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  changeUsername(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    let uname = e.target.value;
    let bad = true;
    if (uname.length>3) {
      bad = false;
    }
    this.setState({
      uname: uname,
      badUname: bad,
      typingTimeout: setTimeout(() => {this.checkUname(uname)}, 750)
    })
  }

  changeEmail(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    let bad = true;
//    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (regex.test(e.target.value)) {
      bad = false;
    }
    let email = e.target.value;
    this.setState({
      email: e.target.value,
      badEmail: bad,
      typingTimeout: setTimeout(() => {this.checkEmail(email)}, 750)
    });
  }

  checkUname(uname) {
    if (!this.state.badUname) {
      fetch(Config.default.host+'/checkuname?uname='+uname,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (!resultJson.ok) {
          this.setState({
            dupUname: true
          });
        } else {
          this.setState({
            dupUname: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  checkEmail(email) {
    if (!this.state.badEmail) {
      fetch(Config.default.host+'/checkemail?email='+email,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (!resultJson.ok) {
          this.setState({
            dupEmail: true
          });
        } else {
          this.setState({
            dupEmail: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
  

  changePassword(e) {
    let bad = false;
    let tooShort = false;
    if (e.target.value !== this.state.pw2) {
      bad = true;
    }
    if (e.target.value.length<7) {
      tooShort = true;
    }
    this.setState({
      pw1: e.target.value,
      badPassword: bad,
      tooShort: tooShort
    });
  }

  changePasswordConfirm(e) {
    let bad = false;
    if (this.state.pw1 !== e.target.value) {
      bad = true;
    }
    this.setState({
      pw2: e.target.value,
      badPassword: bad
    });
  }

  handleCancel() {
    this.props.postRegister();
  }

  handleSave() {
    if (!this.state.badPassword && !this.state.tooShort && !this.state.badEmail  && !this.state.dupEmail && !this.state.dupUname && !this.state.badUname) {
      fetch(Config.default.host+'/register',
        {
          method:'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: this.state.email,
              pw: this.state.pw1,
              uname: this.state.uname
          }),
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (resultJson.ok) {
          this.props.postRegister(resultJson.user);
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  render() {
    return(
      <div>
        <RB.Grid>
          <RB.Row>
            <RB.Col md={4}></RB.Col>
            <RB.Col md={4}>
              <h2>Welcome!</h2>
              <h3>Please sign up to gain full access to our features</h3>
              <RB.FormGroup>
                <h3>What is your desired user name?</h3>
                <RB.FormControl placeholder="User name" value={this.state.uname} onChange={this.changeUsername} />
                {this.state.dupUname &&
                  <div>
                    <RB.Label bsStyle="warning">{this.state.uname} already exists, please choose another.</RB.Label>
                  </div>
                }
                {this.state.badUname &&
                  <div>
                    <RB.Label bsStyle="warning">Username must be more than 3 characters long</RB.Label>
                  </div>
                }
                <h3>What is your email?</h3>
                <RB.FormControl placeholder="email@someaddress.com (required)" type="email" value={this.state.email} onChange={this.changeEmail} />
                {this.state.badEmail &&
                  <div>
                    <RB.Label bsStyle="warning">Invalid Email</RB.Label>
                  </div>
                 }
                {this.state.dupEmail &&
                  <div>
                    <RB.Label bsStyle="warning">Email already exists</RB.Label>
                  </div>
                }
                <h3>Choose a password</h3>
                <RB.FormControl placeholder="password (required)" type="password" onChange={this.changePassword} value={this.state.pw1} />
                <h3>Re-type your password</h3>
                <RB.FormControl placeholder="password confirmation (required)" type="password" onChange={this.changePasswordConfirm} value={this.state.pw2} />
                {this.state.badPassword &&
                  <div>
                    <RB.Label bsStyle="warning">Passwords do not match</RB.Label>
                  </div>
                }
                {this.state.tooShort &&
                  <div>
                    <RB.Label bsStyle="warning">Password is too short</RB.Label>
                  </div>
                }
              </RB.FormGroup>
              <h2><RB.Label className="clickable" bsStyle="warning" onClick={this.handleCancel}>Cancel</RB.Label></h2>
              <h2><RB.Label className="clickable" bsStyle="primary" onClick={this.handleSave}>Save</RB.Label></h2>
            </RB.Col>
            {!this.state.tooShort && !this.state.badPassword && !this.state.dupEmail &&
              <RB.Label bsStyle="success">OK</RB.Label>
            }
            <RB.Col md={4}></RB.Col>
          </RB.Row>
        </RB.Grid>
      </div>
    );
  }
}

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

class ArtistRegistration extends Component {
  constructor() {
    super();
    this.state = {
      artistName: '',
      genre: '',
      image: '',
      th: '',
      orig: '',
      desc: '',
      phone: '',
      email: '',
      webPage: '',
      showFullImage: false,
      userRegister: false,
      userLogin: false,
    };
    this.changeName = this.changeName.bind(this);
    this.changeGenre = this.changeGenre.bind(this);
    this.changeDesc = this.changeDesc.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.changeWebPage = this.changeWebPage.bind(this);
    this.handleUserRegisterClick = this.handleUserRegisterClick.bind(this);
    this.handleUserLoginClick = this.handleUserLoginClick.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.postRegister = this.postRegister.bind(this);
    this.isComplete = this.isComplete.bind(this);
    this.saveArtist = this.saveArtist.bind(this);
    this.showFullImage = this.showFullImage.bind(this);
    this.hideFullImage = this.hideFullImage.bind(this);
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

  isComplete() {
    if (this.state.artistName.length && (this.state.email.length || this.state.phone.length)) {
      this.atBottom.scrollIntoView({ behavior: "smooth" });
      return true;
    } else {
      return false; 
    }
  }
  
  saveArtist() {
    let toSave = {
      artist_name: this.state.artistName,
      genre: this.state.genre,
      phone: this.state.phone,
      email: this.state.email,
      web_page: this.state.webPage,
      desc: this.state.desc
    };
    fetch(Config.default.host + '/saveartist',
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
      this.props.updateUser('hasArtist', true);
      this.props.goManage();
    })
    .catch((err) => {
      console.log(err);
    });
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

  changeName(e) {
    this.setState({
      artistName: e.target.value
    });
  }

  changeGenre(e) {
    this.setState({
      genre: e.target.value
    });
  }

  changeDesc(e) {
    this.setState({
      desc: e.target.value
    });
  }

  changePhone(e) {
    this.setState({
      phone: e.target.value
    });
  }

  changeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  changeWebPage(e) {
    this.setState({
      webPage: e.target.value
    })
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
    return(
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
            {!this.props.user && 
              <div>
                Already registered?  <RB.Label onClick={this.handleUserLoginClick} bsStyle="primary" className="clickable">Login</RB.Label>
              </div>
            }
          <RB.Row>
            <RB.Col md={4}></RB.Col>
            <RB.Col md={4}>
              <RB.FormGroup>
                <div>
                  <h3>What is your name/band&apos;s name/group&apos;s name?</h3>
                  <RB.FormControl onChange={this.changeName} value={this.state.artistName} placeholder="Name..." />
                  <h3>What is the genre for {this.state.artistName} (If more than one, please separate with comma(s))?</h3>
                  <RB.FormControl onChange={this.changeGenre} value={this.state.genre} placeholder="Genre..." />
                  <UploadImage postUpload={this.receiveImage} />
                  {this.state.image &&
                    <div>
                      <img onClick={this.showFullImage} src={Config.default.host + this.state.th} alt="venue_image" />
                    </div>
                  }
                  <h3>Tell us about {this.state.artistName}</h3>
                  <RB.FormControl onChange={this.changeDesc} placeholder="Description...(optional)" componentClass="textarea" value={this.state.desc} />
                  <h3>How do we get in touch?</h3>
                  <RB.FormControl onChange={this.changeEmail} value={this.state.email} placeholder="Email..." />
                  <div> - OR -</div>
                  <RB.FormControl onChange={this.changePhone} value={this.state.phone} placeholder="Phone..." />
                  <h3>Do you have a web page for {this.state.artistName}?</h3>
                  <RB.FormControl onChange={this.changeWebPage} value={this.state.webPage} placeholder="web page...(optional)" />
                  {this.props.user && this.isComplete() &&
                    <div>
                      <h2><RB.Label className="clickable" bsStyle="primary" onClick={this.saveArtist}>Register the artist!</RB.Label></h2>
                    </div>
                  }
                  {!this.props.user &&
                    <div>
                      <div>You have to be a registered user in order to register an artist.</div>
                      <div>You can <RB.Label className="clickable" onClick={this.handleUserRegisterClick}>Register here</RB.Label></div>
                      <div>OR</div>
                      <div>If you already registered, you can <RB.Label className="clickable" bsStyle="primary" onClick={this.handleUserLoginClick}>Login</RB.Label> here</div>
                    </div>
                  }
                </div>
              </RB.FormGroup>
            </RB.Col>
            <RB.Col md={4}>
              {!this.isComplete() &&
                <RB.Label bsStyle="warning">Form incomplete</RB.Label>
              }
              {this.isComplete() &&
                <RB.Label bsStyle="success">OK</RB.Label>
              }
            </RB.Col>
          </RB.Row>
          </div>
        }
        <div style={{clear:'both'}} ref={(el) => {this.atBottom = el; }} />
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
    )
  }
}

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

class MyCalendar extends Component {
  constructor(props) {
    super(props);
    let today = moment();
    let yesterday = moment().subtract(1, 'days');
    var customClass = {
      past: day => day.isBefore(yesterday),
      blackout: this.props.dates.blackout,
      available: this.props.dates.available
    }
    this.state = {
      year: today.year(),
      selectedDay: today,
      toSet: 'available',
      refId: this.props.refId,
      customClass:customClass
    }
		this.onPrevYear = this.onPrevYear.bind(this);
		this.onNextYear = this.onNextYear.bind(this);
		this.onDatePicked = this.onDatePicked.bind(this);
    this.onChangeToSet = this.onChangeToSet.bind(this);
    this.saveAvail = this.saveAvail.bind(this);
  }

  saveAvail() {
    if (this.state.refId) {
      fetch(Config.default.host + '/saveavail',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refid: this.state.refId,
            blackout: this.state.customClass.blackout,
            avail: this.state.customClass.available
          })
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (typeof resultJson.ok === 'undefined') {
          console.log(resultJson.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      console.log('NO REFID!');
    }
  }

  onPrevYear() {
    this.setState({ year: this.state.year-1 });
  }

  onNextYear() {
    this.setState({ year: this.state.year+1 });
  }

  onDatePicked(date) {
    let today = moment();
    if (date.isSameOrAfter(today, 'day')) {
      let customClass = this.state.customClass;
      if (this.state.toSet === 'blackout') {
        let index = customClass.blackout.indexOf(date.format('YYYY-MM-DD'));
        if (index >= 0) {
          customClass.blackout.splice(index, 1);
        } else {
          let index = customClass.available.indexOf(date.format('YYYY-MM-DD'));
          if (index < 0) {
            customClass.blackout.push(date.format('YYYY-MM-DD'));
          }
        }
      } else {
        let index = customClass.available.indexOf(date.format('YYYY-MM-DD'));
        if (index >= 0) {
          customClass.available.splice(index, 1);
        } else {
          let index = customClass.blackout.indexOf(date.format('YYYY-MM-DD'));
          if (index < 0) {
            customClass.available.push(date.format('YYYY-MM-DD'));
          }
        }
      }
      this.saveAvail();
      this.setState({
        selectedDay: date,
        customClass: customClass
      })
    }
	}

  onChangeToSet(e) {
    this.setState({toSet: e.target.value});
  }

  render() {
    return (
      <div>
				<CalendarControls
					year={this.state.year}
					onPrevYear={this.onPrevYear}
					onNextYear={this.onNextYear}
        />
        <RB.FormGroup>
          {this.state.toSet==="available" &&
            <span>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="available" inline checked>Available</RB.Radio>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="blackout" inline>Blackout</RB.Radio>
            </span>
          }
          {this.state.toSet==="blackout" &&
            <span>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="available" inline>Available</RB.Radio>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="blackout" inline checked>Blackout</RB.Radio>
            </span>
          }
        </RB.FormGroup>
        <div>
          Selected dates will be your&nbsp;
          <span>
          {this.state.toSet==='blackout' &&
            <RB.Label bsStyle="warning">Blackout</RB.Label>
          }
          {this.state.toSet === 'available' &&
            <RB.Label bsStyle="warning">Available</RB.Label>
          }
          </span> dates
        </div>
        <Calendar year={this.state.year} selectedDay={this.state.selectedDay} onPickDate={this.onDatePicked} customClasses={this.state.customClass} />
      </div>
    )
  }
}

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

class ArtistManage extends Component {
  constructor()  {
    super();
    this.state = {
      artists: [],
      showCalendar: false,
      availabilityId: 0,
      dates: {}
    }
    this.getArtists = this.getArtists.bind(this);
    this.getArtists();
    this.editCalendar = this.editCalendar.bind(this);
  }

  getArtists() {
    fetch(Config.default.host + '/getartists',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      let res = resultJson;
      this.setState({
        artists: res.artists
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  editCalendar(availabilityId) {
    fetch(Config.default.host + '/getavail?refid='+ availabilityId,
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      let newDates = {
        blackout: resultJson.blackout,
        available: resultJson.available
      };
      this.setState({
        showCalendar:true,
        dates: newDates,
        availabilityId: availabilityId
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
          <div>
            <RB.Grid>
              <RB.Row>
                <RB.Col md={2}></RB.Col>
                <RB.Col md={8}>
                  <RB.Table responsive striped bordered condensed>
                    <thead>
                      <tr>
                        <th>Artist</th>
                        <th>Contact</th>
                        <th>Edit Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.artists.map((artist) => {
                        return (
                          <tr key={artist._id.toString()}>
                            <td>{artist.artist_name}</td>
                            <td>Email: {artist.email}<br />Phone: {artist.phone}</td>
                            <td><CalendarButton handleClick={this.editCalendar} refId={artist._id.toString()} /></td>
                          </tr>
                        )})
                      }
                    </tbody>
                  </RB.Table>
                </RB.Col>
                <RB.Col md={2}></RB.Col>
              </RB.Row>
            </RB.Grid>
            {this.state.showCalendar &&
              <div>
                <RB.Grid>
                  <RB.Row>
                    <RB.Col md={1}></RB.Col>
                    <RB.Col md={10}>
                      <MyCalendar dates={this.state.dates} refId={this.state.availabilityId} />
                      </RB.Col>
                    <RB.Col md={1}></RB.Col>
                  </RB.Row>
                </RB.Grid>
              </div>
            }
          </div>
      </div>
    )
  }
}

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

class FanManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zip: '',
      radius: 0,
      venues: [],
      artist: '',
      found: [],
      showArtist: false,
      idx: -1,
      wants: []
    };
    this.getNearestVenues = this.getNearestVenues.bind(this);
    this.changeArtist = this.changeArtist.bind(this);
    this.onArtistClick = this.onArtistClick.bind(this);
    this.onArtistSearchClick = this.onArtistSearchClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onWant = this.onWant.bind(this);
    this.getNearestVenues();
  }

  onWant() {
    let toSend = {
      artist: this.state.found[this.state.idx]
    };
    fetch(Config.default.host + '/want',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      if (resultJson) {
        this.setState.wants.push(this.props.user.uname);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleCancel() {
    this.setState({
      showArtist: false
    })
  }

  changeArtist(e) {
    this.setState({
      artist: e.target.value
    })
  }

  onArtistClick(idx) {
    this.setState({
      showArtist: true,
      idx: idx
    })
  }

  onArtistSearchClick() {
    if (this.state.artist) {
      fetch(Config.default.host + '/searchartists?artist=' + this.state.artist,
        {
          method:'GET',
          credentials: 'include'
        }
      )
      .then((result) => { return result.json(); })
      .then((resultJson) => {
        this.setState({
          found: resultJson
        })
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  getNearestVenues() {
    fetch(Config.default.host + '/getnearestvenues',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      this.setState({
        zip: this.props.user.fan.zip,
        radius: this.props.user.fan.radius,
        venues: resultJson.venues
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
        {this.state.showArtist && 
          <div>
            <RB.Row>
              <RB.Col md={4}></RB.Col>
                <RB.Col md={4}>
                  <div style={{textAlign:'left'}}>
                  {
                    Object.keys(this.state.found[this.state.idx]).map((key) => {
                        if (typeof this.state.found[this.state.idx][key] !== 'object') {
                          return (
                            <div key={key}>
                              <span>{key}: </span><span>{this.state.found[this.state.idx][key]}</span>
                            </div>
                          )
                        } else {
                          return null;
                        }
                    })
                  }
                  </div>
                </RB.Col>
              <RB.Col md={4}></RB.Col>
            </RB.Row>
            <div>
              <RB.Label bsStyle="success" className="clickable" onClick={this.onWant}>I want to see this Artist/Group/Band</RB.Label>
            </div>
            <div>
              <RB.Label bsStyle="warning" className="clickable" onClick={this.handleCancel}>Cancel</RB.Label>
            </div>
          </div>
        }
        {!this.state.showArtist &&
          <div>
        <div><h3>Origin: {this.state.zip?<span>{this.state.zip}</span>:<Spinner />}</h3></div>
        <div><h3>Maximum travel distance (miles): {this.state.radius}</h3></div>
        <div>
          <RB.Grid>
            <RB.Row>
              <RB.Col md={4}></RB.Col>
              <RB.Col md={4}>
                <div>
                  <RB.FormControl placeholder="Search for artist/band" onChange={this.changeArtist} value={this.state.artist} />
                </div>
                <div>
                  <h2><RB.Label className="clickable" onClick={this.onArtistSearchClick} bsStyle="primary">Search</RB.Label></h2>
                </div>
                {this.state.found.length>0 &&
                  this.state.found.map((artist, idx) => {
                    return( 
                      <div key={artist._id}>
                        <ArtistInfo value={idx} onArtistClick={this.onArtistClick} artist={artist} />
                      </div>
                    )
                  })
                  
                }
              </RB.Col>
              <RB.Col md={4}></RB.Col>
            </RB.Row>
          </RB.Grid>
        </div>
        <div>
          <h3>Venues within your maximum travel distance:</h3>
          <RB.Table>
            <thead>
              <tr>
                <th>Venue</th><th>Location</th><th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.venues.map((venue) => {
                  return(
                    <tr key={venue._id}>
                      <td>{venue.venueName}</td>
                      <td>{venue.address}<br />{venue.address2}<br />{venue.zip}</td>
                      <td>{venue.cap}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </RB.Table>
        </div>
        </div>
        }
      </div>
    )
  }
}

class VenueManage extends Component {
  constructor() {
    super();
    this.state = {
      venues: [],
      dates: {},
      showCalendar: false,
      availabilityId: 0,
      newVenueView: false
    }
    this.getVenues = this.getVenues.bind(this);
    this.editCalendar = this.editCalendar.bind(this);
    this.handleNewVenueClick = this.handleNewVenueClick.bind(this);
    this.postVenueSave = this.postVenueSave.bind(this);
    this.getVenues();
  }

  getVenues() {
    fetch(Config.default.host + '/getvenues',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      let res = resultJson;
      this.setState({
        venues: res.venues
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  editCalendar(availabilityId) {
    fetch(Config.default.host + '/getavail?refid='+ availabilityId,
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      let newDates = {
        blackout: resultJson.blackout,
        available: resultJson.available
      };
      this.setState({
        showCalendar:true,
        dates: newDates,
        availabilityId: availabilityId
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleNewVenueClick() {
    this.setState({
      newVenueView: true
    });
  }

  postVenueSave() {
    this.setState({
      newVenueView: false
    });
    this.getVenues();
  }

  render() {
    return (
      <div>
        <div>
          <RB.Label onClick={this.handleNewVenueClick} className="clickable">Add another venue</RB.Label>
        </div>
        {this.state.newVenueView &&
          <VenueRegistration
            user={this.props.user}
            goManage={this.postVenueSave}
            onCancel={this.postVenueSave}
            updateUser={()=>{}}
          />
        }
        <br />
        <RB.Grid>
          <RB.Row>
            <RB.Col md={2}></RB.Col>
              <RB.Col md={8}>
              <RB.Table responsive striped bordered condensed>
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Status</th>
                    <th>Register Date</th>
                    <th>Capacity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.venues.map((venue) => {
                      return (
                        <tr key={venue._id}>
                          <td>{venue.venueName}</td>
                          <td>{venue.verified?<RB.Label bsStyle="success">Verified</RB.Label>:<RB.Label bsStyle="danger">Unconfirmed</RB.Label>}</td>
                          <td>{moment(venue.ts).format('ddd, MMM Do YYYY')}</td>
                          <td>{venue.cap}</td>
                          <td><CalendarButton handleClick={this.editCalendar} refId={venue._id.toString()} /></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </RB.Table>
            </RB.Col>
            <RB.Col md={2}></RB.Col>
          </RB.Row>
        </RB.Grid>
            {this.state.showCalendar &&
              <div>
                <RB.Grid>
                  <RB.Row>
                    <RB.Col md={1}></RB.Col>
                    <RB.Col md={10}>
                      <MyCalendar dates={this.state.dates} refId={this.state.availabilityId} />
                      </RB.Col>
                    <RB.Col md={1}></RB.Col>
                  </RB.Row>
                </RB.Grid>
              </div>
            }
      </div>
    )
  }
}

class FanRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRegister: false,
      userLogin: false,
      lat: 0,
      lng: 0,
      street: '',
      unit: '',
      prefix: '',
      city: '',
      state: '',
      zip: '',
      radius: 15,
      guessedZip: null,
      incomplete: true
    };
    if (typeof this.props.user.fan !== 'undefined') {
      this.setState({
        zip: this.props.user.fan.zip,
        lng: this.props.user.fan.location[0],
        lat: this.props.user.fan.location[1],
        radius: this.props.user.fan.radius
      })
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          /*
          this.setState({
            lat: 34.087792,
            lon: -118.355764
          });
          */
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        });
      }
    }
    this.changePrefix = this.changePrefix.bind(this);
    this.changeStreet = this.changeStreet.bind(this);
    this.changeUnit = this.changeUnit.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeZip = this.changeZip.bind(this);
    this.changeRadius = this.changeRadius.bind(this);
    this.handleUserLoginClick = this.handleUserLoginClick.bind(this);
    this.handleUserRegisterClick = this.handleUserRegisterClick.bind(this);
    this.postRegister = this.postRegister.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.reverseGeoLookup = this.reverseGeoLookup.bind(this);
    this.isComplete = this.isComplete.bind(this);
    this.saveFan = this.saveFan.bind(this);

    this.reverseGeoLookup();
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

  isComplete() {
    if (this.state.zip.length>4) {
      return true;
    } else {
      return false;
    }
  }

  saveFan() {
    let toSave = {
      zip: this.state.zip,
      radius: this.state.radius
    };
    fetch(Config.default.host + '/savefan',
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
    .then((resultJson) => {
      console.log(resultJson);
      this.props.goManage();
      this.props.updateUser('hasFan', true);
      this.props.updateUser('fan', resultJson.res);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  reverseGeoLookup() {
    fetch(Config.default.host + '/rgl?lat=' + this.state.lat + '&lon=' + this.state.lng,
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      this.setState({guessedZip: resultJson.msg.zip, zip:resultJson.msg.zip, incomplete:false});
    })
    .catch((err) => {
      console.log(err);
    });

  }

  changeRadius(e) {
    console.log(e.target.value);
    this.setState({
      radius: e.target.value
    });
  }

  changePrefix(e) {
    this.setState({prefix: e.target.value});
  }

  changeStreet(e) {
    this.setState({street: e.target.value})
  }

  changeUnit(e) {
    this.setState({unit: e.target.value});
  }

  changeCity(e) {
    this.setState({city: e.target.value});
  }

  changeState(e) {
    this.setState({state: e.target.value});
  }

  changeZip(e) {
    this.setState({zip: e.target.value});
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
            <div>
              <h2>Tell us about yourself</h2>
            </div>
            <div>
              {!this.props.user && 
                <div>
                  Already registered?  <RB.Label onClick={this.handleUserLoginClick} bsStyle="primary" className="clickable">Login</RB.Label>
                </div>
              }
              <RB.Grid>
                <RB.Row>
                  <RB.Col md={4}></RB.Col>
                  <RB.Col md={4}>
                    {this.state.guessedZip &&
                      <div>
                        <div><h3>We think you are in: {this.state.guessedZip}</h3></div>
                        <div>
                          A zip code allows us to determine the venues that are close to you.  Is {this.state.guessedZip} accurate enough?
                          If not, please enter a different zip code:
                          <RB.FormControl onChange={this.changeZip} value={this.state.zip} placeholder="Zip code" />
                        </div>
                      </div>
                    }
                    {!this.state.guessedZip &&
                      <div>
                        A zip code allows us to determine the venues that are close to you.  Please enter zip code:
                        <RB.FormControl onChange={this.changeZip} value={this.state.zip} placeholder="Zip code" />
                      </div>
                    }
                    <div>
                      <h3>How far are you willing to travel from {this.state.zip} to see a show?</h3>
                      <div style={{textAlign:'left'}}>
                      <RB.FormGroup>
                        <RB.Radio name="radiusGroup" onClick={this.changeRadius} value="2">Only within my neighborhood (Very restrictive)</RB.Radio>
                        <RB.Radio name="radiusGroup" onClick={this.changeRadius} value="15" defaultChecked>Across town</RB.Radio>
                        <RB.Radio name="radiusGroup" onClick={this.changeRadius} value="50">50 miles</RB.Radio>
                        <RB.Radio name="radiusGroup" onClick={this.changeRadius} value="100">100 miles</RB.Radio>
                        <RB.Radio name="radiusGroup" onClick={this.changeRadius} value="500">500 miles</RB.Radio>
                        <RB.Radio name="radiusGroup" onClick={this.changeRadius} value="9999">Doesn&apos;t matter.  I will go anywhere</RB.Radio>
                      </RB.FormGroup>
                      </div>
                    </div>
                    {/*
                    <RB.FormGroup>
                      <RB.FormControl placeholder="906 N Doheny Dr." onChange={this.changeStreet} value={this.state.street} />
                      <RB.FormControl placeholder="313 (Unit Number) --- optional" onChange={this.changeUnit} value={this.state.unit}  />
                      <RB.FormControl placeholder="West Hollywood" onChange={this.changeCity} value={this.state.city} />
                      <RB.FormControl placeholder="CA" onChange={this.changeState} value={this.state.state} />
                      <RB.FormControl placeholder="90069 (required)" onChange={this.changeZip} value={this.state.zip} /> 
                    </RB.FormGroup>
                    */
                    }
                  </RB.Col>
                  <RB.Col md={4}></RB.Col>
                </RB.Row>
              </RB.Grid>
            </div>
          </div>
          <div>
          {this.props.user && this.isComplete() &&
            <div>
              <h2><RB.Label className="clickable" bsStyle="primary" onClick={this.saveFan}>Save your preferences!</RB.Label></h2>
            </div>
          }
          {!this.props.user &&
            <div>
              <div>You have to be a registered user in order to be a fan</div>
              <div>You can <RB.Label className="clickable" onClick={this.handleUserRegisterClick}>Register here</RB.Label></div>
              <div>OR</div>
              <div>If you already registered, you can <RB.Label className="clickable" bsStyle="primary" onClick={this.handleUserLoginClick}>Login</RB.Label> here</div>
            </div>
          }
          </div>
          </div>
        }
      </div>
    )
  }
}


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.view,
      userStatusClick: ''  // should only be either '', 'login', or 'register', this indicated that login or register was cllick in the navbar'
    };
    this.setView = this.setView.bind(this);
    this.handleFan = this.handleFan.bind(this);
    this.handleVenue = this.handleVenue.bind(this);
    this.handleArtist = this.handleArtist.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleVenueManagement = this.handleVenueManagement.bind(this);
    this.handleArtistManageMent = this.handleArtistManagement.bind(this);
    this.handleFanManagement = this.handleFanManagement.bind(this);
    this.showLogin = this.showLogin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // handle click on naav/status bar if login or register....
    // why like this?  because we want to be able to have <UserLogin /> and <UserRegister /> to be children of children, not just the child of <Main />
    if (nextProps.userStatusClick === 'login' || nextProps.userStatusClick === 'register') {
      this.setState({
        userStatusClick: nextProps.userStatusClick
      })
    } else { // handle all otherclicks on nav/status bar
      if (!nextProps.userStatusClick) {
        this.setState({
          userStatusClick: null
        })
      }
      if (nextProps.userStatusClick === 'logout' || nextProps.userStatusClick === 'home') {
        this.setState({
          userStatusClick: null,
          view: 'init'
        })
      }
      if (nextProps.userStatusClick === 'vmanage') {
        let view = 'vmanage';
        this.setView(view);
      }
      if (nextProps.userStatusClick === 'amanage') {
        let view = 'amanage';
        this.setView(view);
      }
      if (nextProps.userStatusClick === 'fmanage') {
        let view = 'fmanage';
        this.setView(view);
      }
    }
  }

  setView(view) {
    this.setState({
      userStatusClick: '',
      view: view
    })
  }

  handleFan() {
    this.setView('fan');
  }

  handleVenue() {
    this.setView('venue');
  }

  handleArtist() {
    this.setView('artist');
  }

  handleHome() {
    this.setView('init');
  }

  handleVenueManagement() {
    this.setView('vmanage');
  }

  handleArtistManagement() {
    this.setView('amanage');
  }

  handleFanManagement() {
    this.setView('fmanage');
  }

  showLogin(props) {
    return (
      <UserLogin postLogin={props} />
    )
  }

  showRegister(props) {
    return(
      <UserRegister postRegister={props} />
    )
  }

  render() {
    return (
        <div>
          {this.state.view === 'init' && this.state.userStatusClick === 'login' &&
            <div>
              <UserLogin postLogin={this.props.handleUserLogin} />
            </div>
          }
          {this.state.view === 'init' && this.state.userStatusClick === 'register' && 
            <div>
              <UserRegister postRegister={this.props.handleUserRegister} />
            </div>
          }
          {this.state.view === 'init' &&  !this.state.userStatusClick &&
            <div>
              <div>
                <h2>I am a...</h2>
              </div>
              <div>
                <RB.Grid>
                  <RB.Row>
                    <RB.Col md={3}></RB.Col>
                    <RB.Col md={2}>
                      <h1><RB.Label className="clickable" onClick={this.handleFan} bsStyle="primary">FAN</RB.Label></h1>
                    </RB.Col>
                    <RB.Col md={2}>
                      <h1><RB.Label className="clickable" onClick={this.handleArtist} bsStyle="warning">ARTIST</RB.Label></h1>
                    </RB.Col>
                    <RB.Col md={2}>
                      <h1><RB.Label className="clickable" onClick={this.handleVenue} bsStyle="success">VENUE</RB.Label></h1>
                    </RB.Col>
                    <RB.Col md={3}></RB.Col>
                  </RB.Row>
                </RB.Grid>
              </div>
            </div>
          }
          {this.state.view === 'venue' &&
            <div>
              <VenueRegistration 
                userStatusClick={this.state.userStatusClick}
                showLogin={this.showLogin}
                showRegister={this.showRegister}
                goManage={this.handleVenueManagement}
                handleUserLogin={this.props.handleUserLogin}
                handleUserRegister={this.props.handleUserRegister}
                user={this.props.user}
                updateUser={this.props.updateUser}
              />
            </div>
          }
          {this.state.view === 'fan' &&
            <div>
              <FanRegistration
                userStatusClick={this.state.userStatusClick}
                showLogin={this.showLogin}
                showRegister={this.showRegister}
                goManage={this.handleFanManagement}
                handleUserLogin={this.props.handleUserLogin}
                handleUserRegister={this.props.handleUserRegister}
                user={this.props.user}
                updateUser={this.props.updateUser}
              />
            </div>
          }
          {this.state.view === 'artist' &&
            <div>
              <ArtistRegistration
                userStatusClick={this.state.userStatusClick}
                showLogin={this.showLogin}
                showRegister={this.showRegister}
                goManage={this.handleArtistManagement}
                handleUserLogin={this.props.handleUserLogin}
                handleUserRegister={this.props.handleUserRegister}
                user={this.props.user}
                updateUser={this.props.updateUser}
              />
            </div>
          }
          {this.state.view === 'vmanage' &&
            <div>
              <VenueManage user={this.props.user} />
            </div>
          }
          {this.state.view === 'amanage' &&
            <div>
              <ArtistManage user={this.props.user} />
            </div>
          }
          {this.state.view === 'fmanage' &&
            <div>
              <FanManage  user={this.props.user} />
            </div>
          }
        </div>
    );
  }
}

class UserStatus extends Component {
  render() {
    return (
      <span>
        <RB.Nav bsStyle="pills" pullLeft={true}>
          <RB.NavItem onClick={this.props.handleHomeClick} title="Home"><RB.Label bsStyle="primary" className="clickable">Home</RB.Label></RB.NavItem>
          {this.props.user && this.props.user.hasVenue &&
            <RB.NavItem onClick={this.props.handleVenueClick} className="link" eventKey={1} title="Venues">Your Venues</RB.NavItem>
          }
          {this.props.user && this.props.user.hasArtist &&
            <RB.NavItem onClick={this.props.handleArtistClick} className="link" eventKey={5} title="Artists">Your Artists</RB.NavItem>
          }
          {this.props.user && this.props.user.hasFan &&
            <RB.NavItem onClick={this.props.handleFanClick} className="link" eventKey={5} title="Fan">FAN</RB.NavItem>
          }
        </RB.Nav>
        {this.props.user &&
          <span>
            <RB.Nav pullRight={true}>
              <RB.NavItem disabled>Logged in as:</RB.NavItem>
              <RB.NavItem
                className="link"
                eventKey={2}
                title={this.props.user.email}
              >
                {this.props.user.uname}
              </RB.NavItem>
              <RB.NavItem
                eventKey={3}
                title="Logout"
              >
                <RB.Label className="clickable" bsStyle="primary" onClick={this.props.handleLogout}>Logout</RB.Label>
              </RB.NavItem>
            </RB.Nav>
          </span>
        }
        {!this.props.user &&
          <RB.Nav pullRight={true}>
            <RB.NavItem><RB.Label className="clickable" bsStyle="primary" onClick={this.props.handleLoginClick}>Login</RB.Label></RB.NavItem>
            <RB.NavItem><RB.Label className="clickable" bsStyle="primary" onClick={this.props.handleUserRegisterClick}>Sign Up</RB.Label></RB.NavItem>
          </RB.Nav>
        }
      </span>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      user:null,
      view: 'init',
      userStatusCLick: ''
    }
    this.handleUserRegister = this.handleUserRegister.bind(this);
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleUserRegisterClick = this.handleUserRegisterClick.bind(this);
    this.handleVenueClick = this.handleVenueClick.bind(this);
    this.handleArtistClick = this.handleArtistClick.bind(this);
    this.handleFanClick = this.handleFanClick.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentWillMount() {
    fetch(Config.default.host+'/checksession',
      {
        method: 'GET',
        credentials: 'include'
      }  
    )
    .then((result) => { return result.json() } )
    .then((resultJson) => {
      if (resultJson.user) {
        this.setState({
          user: resultJson.user
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleUserRegister(user) {
    this.setState({
      user: user,
      userStatusClick: null
    });
  }

  handleUserLogin(user) {
    this.setState({
      user: user,
      userStatusClick: null
    });
  }

  handleLogout() {
    fetch(Config.default.host+'/logout',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then(() => {
      this.setState({
        user: null,
        userStatusClick: 'logout'
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleLoginClick() {
    this.setState({
      userStatusClick: 'login'
    });
  }

  handleUserRegisterClick() {
    this.setState({
      userStatusClick: 'register'
    });
  }

  handleVenueClick() {
    this.setState({
      userStatusClick: 'vmanage'
    });
  }

  handleArtistClick() {
    this.setState({
      userStatusClick: 'amanage'
    });
  }

  handleFanClick() {
    this.setState({
      userStatusClick: 'fmanage'
    })
  }

  handleHomeClick() {
    this.setState({
      userStatusClick: 'home'
    });
  }

  updateUser(key, value) {
    let user = this.state.user;
    user[key] = value;
    this.setState({user: user});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <RB.Navbar>
          <UserStatus
            user={this.state.user}
            handleVenueClick={this.handleVenueClick}
            handleArtistClick={this.handleArtistClick}
            handleFanClick={this.handleFanClick}
            handleLoginClick={this.handleLoginClick}
            handleUserRegisterClick={this.handleUserRegisterClick}
            handleLogout={this.handleLogout}
            handleHomeClick={this.handleHomeClick}
          />
        </RB.Navbar>
        <Main
          handleUserLogin={this.handleUserLogin}
          handleUserRegister={this.handleUserRegister}
          user={this.state.user}
          userStatusClick={this.state.userStatusClick}
          view={this.state.view}
          updateUser={this.updateUser}
        />
      </div>
    );
  }
}

export default App;
