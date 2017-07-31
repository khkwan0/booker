import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config.js';
import fetch from 'isomorphic-fetch';
import { Calendar, CalendarControls } from 'react-yearly-calendar';
import moment from 'moment';

class MyCalendar extends Component {
  constructor(props) {
    super(props);
    let today = moment();
    let yesterday = moment().subtract(1, 'days');
    var customClass = {
      past: day => day.isBefore(yesterday),
      blackout: this.props.dates.blackout,
      available: this.props.dates.available
    }
    this.state = {
      year: today.year(),
      selectedDay: today,
      toSet: 'available',
      refId: this.props.refId,
      customClass:customClass
    }
		this.onPrevYear = this.onPrevYear.bind(this);
		this.onNextYear = this.onNextYear.bind(this);
		this.onDatePicked = this.onDatePicked.bind(this);
    this.onChangeToSet = this.onChangeToSet.bind(this);
    this.saveAvail = this.saveAvail.bind(this);
  }

  saveAvail() {
    if (this.state.refId) {
      fetch(Config.default.host + '/saveavail',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refid: this.state.refId,
            blackout: this.state.customClass.blackout,
            avail: this.state.customClass.available
          })
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (typeof resultJson.ok === 'undefined') {
          console.log(resultJson.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      console.log('NO REFID!');
    }
  }

  onPrevYear() {
    this.setState({ year: this.state.year-1 });
  }

  onNextYear() {
    this.setState({ year: this.state.year+1 });
  }

  onDatePicked(date) {
    let today = moment();
    if (date.isSameOrAfter(today, 'day')) {
      let customClass = this.state.customClass;
      if (this.state.toSet === 'blackout') {
        let index = customClass.blackout.indexOf(date.format('YYYY-MM-DD'));
        if (index >= 0) {
          customClass.blackout.splice(index, 1);
        } else {
          let index = customClass.available.indexOf(date.format('YYYY-MM-DD'));
          if (index < 0) {
            customClass.blackout.push(date.format('YYYY-MM-DD'));
          }
        }
      } else {
        let index = customClass.available.indexOf(date.format('YYYY-MM-DD'));
        if (index >= 0) {
          customClass.available.splice(index, 1);
        } else {
          let index = customClass.blackout.indexOf(date.format('YYYY-MM-DD'));
          if (index < 0) {
            customClass.available.push(date.format('YYYY-MM-DD'));
          }
        }
      }
      this.saveAvail();
      this.setState({
        selectedDay: date,
        customClass: customClass
      })
    }
	}

  onChangeToSet(e) {
    this.setState({toSet: e.target.value});
  }

  render() {
    return (
      <div>
				<CalendarControls
					year={this.state.year}
					onPrevYear={this.onPrevYear}
					onNextYear={this.onNextYear}
        />
        <RB.FormGroup>
          {this.state.toSet==="available" &&
            <span>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="available" inline checked>Available</RB.Radio>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="blackout" inline>Blackout</RB.Radio>
            </span>
          }
          {this.state.toSet==="blackout" &&
            <span>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="available" inline>Available</RB.Radio>
              <RB.Radio onChange={this.onChangeToSet} name="optGroup" value="blackout" inline checked>Blackout</RB.Radio>
            </span>
          }
        </RB.FormGroup>
        <div>
          Selected dates will be your&nbsp;
          <span>
          {this.state.toSet==='blackout' &&
            <RB.Label bsStyle="warning">Blackout</RB.Label>
          }
          {this.state.toSet === 'available' &&
            <RB.Label bsStyle="warning">Available</RB.Label>
          }
          </span> dates
        </div>
        <Calendar year={this.state.year} selectedDay={this.state.selectedDay} onPickDate={this.onDatePicked} customClasses={this.state.customClass} />
      </div>
    )
  }
}

export default MyCalendar;
