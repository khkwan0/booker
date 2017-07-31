import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import UserRegister from './UserRegister';
import UserLogin from './UserLogin';
import FanManage from './FanManage';
import VenueManage from './VenueManage';
import FanRegistration from './FanRegistration';
import ArtistRegistration from './ArtistRegistration';
import ArtistManage from './ArtistManage';
import VenueRegistration from './VenueRegistration';

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

export default Main;
