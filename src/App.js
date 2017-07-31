import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';
import logo from './logo.png';
import './App.css';
import Main from './Main';
import UserStatus from './UserStatus';

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
