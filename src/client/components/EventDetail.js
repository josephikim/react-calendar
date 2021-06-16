import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

import Error from './Error';
import { createEvent, updateEvent, deleteEvent } from '../actions/calendarActions';

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
      formData: {
        title: '',
        desc: '',
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end,
      },
      error: null
    }
  }

  componentDidUpdate = (prevProps) => {
    // Update state based on props.selectedSlot
    if (this.props.selectedSlot &&
      Object.keys(this.props.selectedSlot).length > 0 &&
      prevProps.selectedSlot !== this.props.selectedSlot) {
      this.setState({
        title: '',
        desc: '',
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end,
        formData: {
          title: '',
          desc: '',
          startDate: this.props.selectedSlot.start,
          endDate: this.props.selectedSlot.end
        }
      });
    }
    // Update state based on props.selectedEvent
    if (this.props.selectedEvent &&
      Object.keys(this.props.selectedEvent).length > 0 &&
      prevProps.selectedEvent !== this.props.selectedEvent) {
      this.setState({
        title: this.props.selectedEvent.title,
        desc: this.props.selectedEvent.desc,
        startDate: this.props.selectedEvent.startDate,
        endDate: this.props.selectedEvent.endDate,
        formData: {
          title: this.props.selectedEvent.title,
          desc: this.props.selectedEvent.desc,
          startDate: this.props.selectedEvent.startDate,
          endDate: this.props.selectedEvent.endDate
        }
      });
    }
  }

  handleChange = event => {
    const { target: { name, value } } = event;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    });
  }

  handleStartDayChange = day => {
    const newState = {
      startDate: day
    }
    // only update endDate when a later date is selected
    if (day > this.state.endDate) {
      newState.endDate = day;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleEndDayChange = day => {
    const newState = {
      endDate: day
    }
    // only update startDate when an earlier date is selected
    if (day < this.state.startDate) {
      newState.startDate = day;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      title: this.state.formData.title,
      desc: this.state.formData.desc,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate
    }
    try {
      this.props.createEvent(data);
    } catch (err) {
      this.setState({ error: err.response.data })
    }
  }

  handleSave = (event) => {
    event.preventDefault();
    const data = {
      _id: this.props.selectedEvent._id,
      title: this.state.formData.title,
      desc: this.state.formData.desc,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate
    }
    const titleChanged = data.title !== this.state.title;
    const descChanged = data.desc !== this.state.desc;
    const startDateChanged = data.startDate !== this.state.startDate;
    const endDateChanged = data.endDate !== this.state.endDate;
    if (!titleChanged && !descChanged && !startDateChanged && !endDateChanged) {
      console.log('please make changes before saving')
    }
    try {
      this.props.updateEvent(data);
    } catch (err) {
      this.setState({ error: err.response.data })
    }
  }

  handleDelete = (event) => {
    if (!this.props.selectedEvent) return;

    event.preventDefault();
    const eventId = this.props.selectedEvent._id;
    try {
      this.props.deleteEvent(eventId);
    } catch (err) {
      this.setState({ error: err.response.data })
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
        <Container>
          <div className="notif">
            {this.state.error && <Error error={this.state.error.messages} />}
          </div>
          <form
            id='event-detail-form'
            name='event-detail-form'
            className='validate'
            onSubmit={this.handleSubmit}
            target='_blank'
            noValidate
          >
            <label htmlFor='title'>Event Title (required)</label>
            <textarea
              name='title'
              className={`input ${titleFail ? "input--fail" : null} `}
              rows='1'
              onChange={this.handleChange}
              value={this.state.formData.title}
            >
              enter title
            </textarea>

            <label htmlFor='desc'>Event Description</label>
            <textarea
              name='desc'
              rows='3'
              onChange={this.handleChange}
              value={this.state.formData.desc}
            >
              enter description
            </textarea>

            <label htmlFor='startDate'>Event Start</label>
            <DayPickerInput
              className={`input ${startDateFail ? "input--fail" : null} `}
              formatDate={formatDate}
              parseDate={parseDate}
              value={`${formatDate(this.state.formData.startDate)}`}
              onDayChange={this.handleStartDayChange}
            />

            <label htmlFor='endDate'>Event End</label>
            <DayPickerInput
              className={`input ${endDateFail ? "input--fail" : null} `}
              formatDate={formatDate}
              parseDate={parseDate}
              value={`${formatDate(this.state.formData.endDate)}`}
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
              <input
                type='button'
                value='Save Changes'
                name='save-changes-btn'
                id='save-changes-btn'
                className='button'
                onClick={this.handleSave}
              />
              <input
                type='button'
                value='Delete Event'
                name='delete-event-btn'
                id='delete-event-btn'
                className='button'
                onClick={this.handleDelete}
              />
            </div>
          </form>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedSlot: state.calendar.selectedSlot,
    selectedEvent: state.calendar.selectedEvent
  };
};

const mapActionsToProps = {
  createEvent,
  updateEvent,
  deleteEvent
}

export default connect(mapStateToProps, mapActionsToProps)(EventDetail);