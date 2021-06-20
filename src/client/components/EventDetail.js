import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
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
        startTime: moment().hour(0).minute(0),
        endTime: moment().hour(0).minute(0)
      },
      validateTitleOnChange: false,
      titleError: '',
      submitCalled: false,
      timeFormat: 'h:mm a',
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
    // only update end date when a later date is selected
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
    // only update start date when an earlier date is selected
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
    const newState = {
      startTime: value
    }
    // only update end time when a later time is selected
    if (this.state.formData.endTime.isSameOrBefore(value)) {
      newState.endTime = newState.startTime.clone().add(15, 'minutes');
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleEndTimeChange = (value) => {
    const newState = {
      endTime: value
    }
    // only update start time when an earlier time is selected
    if (this.state.formData.startTime.isSameOrAfter(value)) {
      newState.startTime = newState.endTime.clone().subtract(15, 'minutes');
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
    const titleFail = !!this.state.titleError;
    const slotSelected = Object.keys(this.props.selectedSlot).length > 0;
    const eventSelected = Object.keys(this.props.selectedEvent).length > 0;
    return (
      <div id="event-detail">
        <form
          id='event-detail-form'
          name='event-detail-form'
          className='validate'
          onSubmit={this.handleSubmit}
          target='_blank'
          noValidate
        >
          <Row>
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
          </Row>
          <Row>
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
          </Row>
          <Row className='two-column'>
            <Col>
              <label htmlFor='startDate'>Start Date</label>
              <DayPickerInput
                formatDate={formatDate}
                parseDate={parseDate}
                value={`${formatDate(this.state.formData.startDate)}`}
                onDayChange={this.handleStartDayChange}
              />
            </Col>
            <Col>
              <label htmlFor='startTime'>Start Time</label>
              <TimePicker
                showSecond={false}
                value={this.state.formData.startTime}
                onChange={this.handleStartTimeChange}
                format={this.state.timeFormat}
                minuteStep={15}
                use12Hours
                inputReadOnly
              />
            </Col>
          </Row>
          <Row className='two-column'>
            <Col>
              <label htmlFor='endDate'>End Date</label>
              <DayPickerInput
                formatDate={formatDate}
                parseDate={parseDate}
                value={`${formatDate(this.state.formData.endDate)}`}
                onDayChange={this.handleEndDayChange}
              />
            </Col>
            <Col>
              <label htmlFor='endTime'>End Time</label>
              <TimePicker
                showSecond={false}
                value={this.state.formData.endTime}
                onChange={this.handleEndTimeChange}
                format={this.state.timeFormat}
                minuteStep={15}
                use12Hours
                inputReadOnly
              />
            </Col>
          </Row>
          <Row>
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
          </Row>
        </form>
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