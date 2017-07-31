import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import Spinner from './Spinner';
import fetch from 'isomorphic-fetch';

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

export default UserLogin;
