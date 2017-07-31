import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';

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

export default FanRegistration;
