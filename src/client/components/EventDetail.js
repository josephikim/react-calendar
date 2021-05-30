import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

import Error from './Error';
import { createEvent } from '../actions/calendarActions';

import '../styles/EventDetail.css';
import 'react-day-picker/lib/style.css';

class EventDetail extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      title: '',
      desc: '',
      startDate: this.props.selectedSlot.start,
      endDate: this.props.selectedSlot.end,
      error: null
    }
  }
  
  componentDidUpdate = (prevProps) => {
    if(prevProps.selectedSlot !== this.props.selectedSlot) {
      this.setState({ 
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end
      });
    }
  }

  handleChange = event => {
    const { target: { name, value } } = event;
    this.setState({ [name]: value });
  }

  handleStartDayChange = day => {
    const newState = {
      startDate: day
    }
    // only update endDate when a later date is selected
    if(day > this.state.endDate){
      newState.endDate = day;
    }
    this.setState(newState);
  }

  handleEndDayChange = day => {
    this.setState({ endDate: day });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      title: this.state.title,
      desc: this.state.desc,
      startDate: this.state.startDate,
      endDate: this.state.endDate     
    }
    try {
      this.props.createEvent(formData);
    } catch (err) {
      this.setState({error: err.response.data})
    }
  }

  render() {
    let invalidFields;
    this.state.error ? invalidFields = this.state.error.fields : invalidFields = [];
    const titleFail = invalidFields.includes("titles");
    const startDateFail = invalidFields.includes("startDate");
    const endDateFail = invalidFields.includes("endDate");
    return (
      <div id="event-detail">
        <Row>
          <div className="notif">
            {this.state.error && <Error error={this.state.error.messages}/> }
          </div>
          <form
            id='event-detail-form'
            name='event-detail-form'
            className='validate'
            onSubmit={this.handleSubmit}
            target='_blank'
            noValidate
          >
            <div> HMR TEST 2</div>
            <label htmlFor='title'>Event Title (required)</label>
            <textarea
              name='title'
              className={`input ${titleFail ? "input--fail" : null} `}
              rows='1'
              onChange={this.handleChange}
              value={this.state.title}
            >
              enter title
            </textarea>

            <label htmlFor='desc'>Event Description</label>
            <textarea
              name='desc'
              rows='3'
              onChange={this.handleChange}
              value={this.state.desc}
            >
              enter description
            </textarea>

            <label htmlFor='startDate'>Event Start</label>
            <DayPickerInput
              className={`input ${startDateFail ? "input--fail" : null} `}
              formatDate={formatDate}
              parseDate={parseDate}
              placeholder={`${formatDate(this.state.startDate)}`}
              onDayChange={this.handleStartDayChange}
            />

            <label htmlFor='endDate'>Event End</label>
            <DayPickerInput
              className={`input ${endDateFail ? "input--fail" : null} `}
              formatDate={formatDate}
              parseDate={parseDate}
              placeholder={`${formatDate(this.state.endDate)}`}
              onDayChange={this.handleEndDayChange}
            />

            <div className='submit'>
              <input
                type='submit'
                value='Add Event'
                name='add-event-btn'
                id='add-event-btn'
                className='button'
              />
            </div>
          </form>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedSlot: state.calendar.selectedSlot,
    selectedEvent: state.calendar.selectedEvent,
    newEvent: state.calendar.newEvent
  };
};

const mapActionsToProps = {
  createEvent
}

export default connect(mapStateToProps, mapActionsToProps)(EventDetail);