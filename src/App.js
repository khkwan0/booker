import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import logo from './logo.png';
import './App.css';
import Config from './config.js';

class UserLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      pw: '',
      invalid: false,
      forgot: false
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
      email: e.target.value
    });
  }

  changePassword(e) {
    this.setState({
      pw: e.target.value
    });
  }

  handleLogin() {
    if (this.state.email && this.state.pw) {
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
            invalid: true
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
                  <h3><RB.Label className="clickable" onClick={this.handleLogin} bsStyle="primary">Login</RB.Label></h3>
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
    email: '',
    pw1: '',
    pw2: '',
    badPassword: false,
    tooShort: true ,
      badEmail: true,
      dupEmail: false,
      typingTimeout: 0

    }
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordConfirm = this.changePasswordConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
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
    if (!this.state.badPassword && !this.state.tooShort && !this.state.badEmail  && !this.state.dupEmail) {
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
              pw: this.state.pw1
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
                <h3>What is your email?</h3>
                <RB.FormControl placeholder="email@someaddress.com (required)" type="email" value={this.state.email} onChange={this.changeEmail} />
                <h3>Choose a password</h3>
                <RB.FormControl placeholder="password (required)" type="password" onChange={this.changePassword} value={this.state.pw1} />
                <h3>Re-type your password</h3>
                <RB.FormControl placeholder="password confirmation (required)" type="password" onChange={this.changePasswordConfirm} value={this.state.pw2} />

              </RB.FormGroup>
              <h2><RB.Label className="clickable" bsStyle="warning" onClick={this.handleCancel}>Cancel</RB.Label></h2>
              <h2><RB.Label className="clickable" bsStyle="primary" onClick={this.handleSave}>Save</RB.Label></h2>
            </RB.Col>
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
            {this.state.badEmail &&
              <div>
                <RB.Label bsStyle="warning">Invalid Email</RB.Label>
              </div>
             }
            {!this.state.tooShort && !this.state.badPassword && !this.state.dupEmail &&
              <RB.Label bsStyle="success">OK</RB.Label>
            }
            {this.state.dupEmail &&
              <div>
                <RB.Label bsStyle="warning">Email already exists</RB.Label>
              </div>
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

class VenueRegistration extends Component {
  constructor() {
    super();
    this.state = {
      venueName: '',
      address: '',
      address2: '',
      zip: '',
      cap: '',
      image: '',
      th: '',
      orig: '',
      desc: '',
      email: '',
      phone: '',
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
        address2: this.state.address2,
        zip: this.state.zip,
        cap: this.state.cap,
        image: this.state.image,
        th: this.state.th,
        orig: this.state.orig,
        desc: this.state.desc,
        phone: this.state.phone,
        email: this.state.email
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
      .then((resultJson) => {
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

  changeAddress(e) {
    this.setState({
      address: e.target.value
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
    this.setState({
      zip: e.target.value
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
              </RB.FormGroup>
              <div>
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

class VenueManage extends Component {
  constructor() {
    super();
    this.state = {
      venues: []
    }
    this.getVenues = this.getVenues.bind(this);
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

  render() {
    return (
      <div>
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
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.venues.map((venue) => {
                      return (
                        <tr key={venue._id}>
                          <td>{venue.venueName}</td>
                          <td>{venue.verified?<RB.Label bsStyle="success">Verified</RB.Label>:<RB.Label bsStyle="danger">Unconfirmed</RB.Label>}</td>
                          <td>{venue.ts}</td>
                          <td>{venue.address}<br />{venue.address2}<br />{venue.zip}</td>
                          <td>{venue.cap}</td>
                          <td>Email: {venue.email}<br />Phone: {venue.phone}</td>
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
      </div>
    )
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.view,
      userStatusClick: ''
    };
    this.setView = this.setView.bind(this);
    this.handleFan = this.handleFan.bind(this);
    this.handleVenue = this.handleVenue.bind(this);
    this.handleArtist = this.handleArtist.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleVenueManagement = this.handleVenueManagement.bind(this);
    this.showLogin = this.showLogin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userStatusClick: nextProps.userStatusClick
    })
  }

  setView(view) {
    this.setState({
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
              Fan
            </div>
          }
          {this.state.view === 'artist' &&
            <div>
              Artist
            </div>
          }
          {this.state.view === 'vmanage' &&
            <div>
              <VenueManage />
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
        {this.props.user &&
        <span>
          {this.props.user.hasVenue &&
            <RB.Nav bsStyle="pills" pullLeft={true}>
              <RB.NavItem className="link" eventKey={1} title="Venues">Your Venues</RB.NavItem>
            </RB.Nav>
          }
          <RB.Nav pullRight={true}>
            <RB.NavItem disabled>Logged in as:</RB.NavItem>
            <RB.NavItem className="link" eventKey={2} title={this.props.user.email}>{this.props.user.email}</RB.NavItem>
            <RB.NavItem eventKey={3} title="Logout"><RB.Label className="clickable" bsStyle="primary" onClick={this.props.handleLogout}>Logout</RB.Label></RB.NavItem>
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
      userStatusClick: ''
    });
  }

  handleUserLogin(user) {
    this.setState({
      user: user,
      userStatusClick: ''
    });
  }

  handleLogout() {
    fetch(Config.default.host+'/logout',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => {
      this.setState({
        user: null
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
          <UserStatus user={this.state.user} handleVenueClick={this.handleVenueClick} handleLoginClick={this.handleLoginClick} handleUserRegisterClick={this.handleUserRegisterClick} handleLogout={this.handleLogout} />
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
