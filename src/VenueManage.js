import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import CalendarButton from './CalendarButton';
import MyCalendar from './MyCalendar';
import VenueRegistration from './VenueRegistration';

class VenueManage extends Component {
  constructor() {
    super();
    this.state = {
      venues: [],
      dates: {},
      showCalendar: false,
      availabilityId: 0,
      newVenueView: false
    }
    this.getVenues = this.getVenues.bind(this);
    this.editCalendar = this.editCalendar.bind(this);
    this.handleNewVenueClick = this.handleNewVenueClick.bind(this);
    this.postVenueSave = this.postVenueSave.bind(this);
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

  handleNewVenueClick() {
    this.setState({
      newVenueView: true
    });
  }

  postVenueSave() {
    this.setState({
      newVenueView: false
    });
    this.getVenues();
  }

  render() {
    return (
      <div>
        <div>
          <RB.Label onClick={this.handleNewVenueClick} className="clickable">Add another venue</RB.Label>
        </div>
        {this.state.newVenueView &&
          <VenueRegistration
            user={this.props.user}
            goManage={this.postVenueSave}
            onCancel={this.postVenueSave}
            updateUser={()=>{}}
          />
        }
        <br />
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
                    <th>Capacity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.venues.map((venue) => {
                      return (
                        <tr key={venue._id}>
                          <td>{venue.venueName}</td>
                          <td>{venue.verified?<RB.Label bsStyle="success">Verified</RB.Label>:<RB.Label bsStyle="danger">Unconfirmed</RB.Label>}</td>
                          <td>{moment(venue.ts).format('ddd, MMM Do YYYY')}</td>
                          <td>{venue.cap}</td>
                          <td><CalendarButton handleClick={this.editCalendar} refId={venue._id.toString()} /></td>
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
    )
  }
}

export default VenueManage;
