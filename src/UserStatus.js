import React, { Component } from 'react';
import * as RB from 'react-bootstrap';

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

export default UserStatus;
