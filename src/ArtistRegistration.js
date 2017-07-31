import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import UploadImage from './UploadImage';
import fetch from 'isomorphic-fetch';

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

export default ArtistRegistration;
