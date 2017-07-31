import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';

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
    if (uname.length>2) {
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
                    <RB.Label bsStyle="warning">Username must be more than 2 characters long</RB.Label>
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

export default UserRegister;
