import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

import { createEvent, updateEvent, deleteEvent } from '../actions/calendarActions';
import { validateFields } from '../validation.js';

import '../styles/EventDetail.css';
import 'react-day-picker/lib/style.css';
import 'rc-time-picker/assets/index.css';

class EventDetail extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      formData: {
        title: '',
        desc: '',
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end,
      },
      validateTitleOnChange: false,
      titleError: '',
      submitCalled: false
    }
  }

  componentDidUpdate = (prevProps) => {
    const slotSelected = Object.keys(this.props.selectedSlot).length > 0;
    const eventSelected = Object.keys(this.props.selectedEvent).length > 0;
    const noneSelected = !slotSelected && !eventSelected;

    const slotUnchanged = _.isEqual(this.props.selectedSlot, prevProps.selectedSlot)
    const eventUnchanged = _.isEqual(this.props.selectedEvent, prevProps.selectedEvent)

    if (slotUnchanged && eventUnchanged) return;

    const newState = {
      ...this.state,
      validateTitleOnChange: false,
      titleError: '',
    }

    if (noneSelected) {
      newState.formData = {
        title: '',
        desc: '',
        startDate: new Date(),
        endDate: new Date()
      }
    } else if (slotSelected) {
      newState.formData = {
        title: '',
        desc: '',
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end
      }
    } else if (eventSelected) {
      newState.formData = {
        title: this.props.selectedEvent.title,
        desc: this.props.selectedEvent.desc,
        startDate: this.props.selectedEvent.startDate,
        endDate: this.props.selectedEvent.endDate
      }
    }
    this.setState(newState);
  }

  handleBlur = event => {
    const { target: { name, value } } = event;
    if (
      this.state.validateTitleOnChange === false &&
      this.state.submitCalled === false
    ) {
      const newState = {
        ...this.state,
        formData: {
          ...this.state.formData,
          [name]: value
        },
        validateTitleOnChange: true,
        titleError: validateFields.validateTitle(value)
      }
      this.setState(newState);
    }
    return;
  }

  handleChange = event => {
    const { target: { name, value } } = event;
    const newState = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [name]: value
      }
    }
    if (name === 'title') {
      newState.titleError = this.state.validateTitleOnChange ? validateFields.validateTitle(value) : ''
    }
    this.setState(newState);
  }

  handleStartDayChange = day => {
    const newState = {
      startDate: day
    }
    // only update endDate when a later date is selected
    if (day > this.state.formData.endDate) {
      newState.endDate = day;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleEndDayChange = (day) => {
    const newState = {
      endDate: day
    }
    // only update startDate when an earlier date is selected
    if (day < this.state.formData.startDate) {
      newState.startDate = day;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleStartTimeChange = (value) => {
    console.log('value', value)
    console.log(value && value.format(format));
  }

  handleEndTimeChange = (value) => {
    console.log('value', value)
    console.log(value && value.format(format));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      title: this.state.formData.title,
      desc: this.state.formData.desc,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate
    }
    const titleError = validateFields.validateTitle(data.title);
    if (!titleError) {
      try {
        const newState = {
          ...this.state,
          validateTitleOnChange: false,
          titleError: '',
          submitCalled: false
        }
        this.props.createEvent(data).then(this.setState(newState));
      } catch (err) {
        this.setState({ error: err.response.data })
      }
    } else {
      const newState = {
        validateTitleOnChange: true,
        titleError
      }
      this.setState(newState);
    }
  }

  handleSave = (event) => {
    event.preventDefault();
    if (this.state.titleError) return;

    const data = {
      _id: this.props.selectedEvent._id,
      title: this.state.formData.title,
      desc: this.state.formData.desc,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate
    }
    const titleChanged = data.title !== this.props.selectedEvent.title;
    const descChanged = data.desc !== this.props.selectedEvent.desc;
    const startDateChanged = data.startDate !== this.props.selectedEvent.startDate;
    const endDateChanged = data.endDate !== this.props.selectedEvent.endDate;
    const formValuesChanged = titleChanged || descChanged || startDateChanged || endDateChanged;

    if (formValuesChanged) {
      try {
        const newState = {
          ...this.state,
          validateTitleOnChange: false,
          titleError: ''
        }
        this.props.updateEvent(data).then(this.setState(newState));
      } catch (err) {
        this.setState({ error: err.response.data })
      }
    } else {
      alert('Please make changes before saving')
    }
  }

  handleDelete = (event) => {
    event.preventDefault();
    if (!this.props.selectedEvent) return;
    const eventId = this.props.selectedEvent._id;
    try {
      this.props.deleteEvent(eventId);
    } catch (err) {
      this.setState({ error: err.response.data })
    }
  }

  render() {
    const format = 'h:mm a';
    const now = moment().hour(0).minute(0);
    const titleFail = !!this.state.titleError;
    const slotSelected = Object.keys(this.props.selectedSlot).length > 0;
    const eventSelected = Object.keys(this.props.selectedEvent).length > 0;
    return (
      <div id="event-detail">
        <Container>
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
              onBlur={this.handleBlur}
              value={this.state.formData.title}
            >
              enter title
            </textarea>
            <div className="text-danger">
              <small>{this.state.titleError}</small>
            </div>

            <label htmlFor='desc'>Event Description</label>
            <textarea
              name='desc'
              className='input'
              rows='3'
              onChange={this.handleChange}
              value={this.state.formData.desc}
            >
              enter description
            </textarea>

            <label htmlFor='startDate'>Start Date</label>
            <DayPickerInput
              className='day-picker-input'
              formatDate={formatDate}
              parseDate={parseDate}
              value={`${formatDate(this.state.formData.startDate)}`}
              onDayChange={this.handleStartDayChange}
            />

            <label htmlFor='startTime'>Start Time</label>
            <TimePicker
              showSecond={false}
              defaultValue={now}
              className='time-picker-input'
              onChange={this.handleStartTimeChange}
              format={format}
              use12Hours
              inputReadOnly
            />

            <label htmlFor='endDate'>End Date</label>
            <DayPickerInput
              className='day-picker-input'
              formatDate={formatDate}
              parseDate={parseDate}
              value={`${formatDate(this.state.formData.endDate)}`}
              onDayChange={this.handleEndDayChange}
            />

            <label htmlFor='endTime'>End Time</label>
            <TimePicker
              showSecond={false}
              defaultValue={now}
              className='time-picker-input'
              onChange={this.handleEndTimeChange}
              format={format}
              use12Hours
              inputReadOnly
            />

            <div className='submit'>
              {slotSelected &&
                <Button
                  as='input'
                  type='submit'
                  value='Add Event'
                  name='add-event-btn'
                  id='add-event-btn'
                  className='button'
                  variant='primary'
                  onMouseDown={() => this.setState({ submitCalled: true })}
                />
              }
              {eventSelected &&
                <Button
                  as='input'
                  value='Save Changes'
                  name='save-changes-btn'
                  id='save-changes-btn'
                  className='button'
                  variant='success'
                  onClick={this.handleSave}
                />
              }
              {eventSelected &&
                <Button
                  as='input'
                  value='Delete Event'
                  name='delete-event-btn'
                  id='delete-event-btn'
                  className='button'
                  variant='danger'
                  onClick={this.handleDelete}
                />
              }
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