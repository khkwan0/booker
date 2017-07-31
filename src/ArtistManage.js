import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';
import MyCalendar from './MyCalendar';
import CalendarButton from './CalendarButton';

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


export default ArtistManage;
