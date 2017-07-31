import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';
import Spinner from './Spinner';
import ArtistInfo from './ArtistInfo';

class FanManage extends Component {
  constructor() {
    super();
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
    this.getWants = this.getWants.bind(this);
  }

  componentDidMount() {
    this.getNearestVenues();
    this.getWants();
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
        this.setState({
          showArtist: false
        })
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  getWants() {
    fetch(Config.default.host + '/getwants',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      if (resultJson) {
        this.setState({
          wants:resultJson
        })
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
                    <div>
                      <h3>Artists/Bands you would like to see:</h3>
                      {this.state.wants.length > 0 &&
                        <RB.Table responsive>
                          <thead>
                            <tr><th>Artist/Band</th><th>Other people near you who want to see the show</th><th>Origin (zip)</th></tr>
                          </thead>
                          <tbody>
                            {
                              this.state.wants.map((want) => {
                                return (
                                  <tr key={want._id}><td>{want.artist.name}</td><td></td><td>{want.user.fan.zip}</td></tr>
                                )
                              })
                            }
                          </tbody>
                        </RB.Table>
                      }
                      {!this.state.wants.length &&
                        <span>None...search for some artists :)</span>
                      }
                    </div>
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

export default FanManage;
