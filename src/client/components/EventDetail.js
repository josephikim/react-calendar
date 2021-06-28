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

const initialState= {
  title: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  desc: {
    value: ''
  },
  startDate: {
    value: new Date()
  },
  endDate: {
    value: new Date()
  },
  startTime: {
    value: moment().hour(0).minute(0)
  },
  endTime: {
    value: moment().hour(0).minute(15)
  },
  submitCalled: false,
  timeFormat: 'h:mm a',
  error: ''
}
class EventDetail extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  componentDidUpdate = (prevProps) => {
    const slotSelected = Object.keys(this.props.selectedSlot).length > 0;
    const eventSelected = Object.keys(this.props.selectedEvent).length > 0;
    const noneSelected = !slotSelected && !eventSelected;
    const slotUnchanged = _.isEqual(this.props.selectedSlot, prevProps.selectedSlot)
    const eventUnchanged = _.isEqual(this.props.selectedEvent, prevProps.selectedEvent)

    if (slotUnchanged && eventUnchanged) return;

    let newState = {};

    if (noneSelected) newState = initialState;

    if (slotSelected) {
      newState = {
        startDate: {
          value: this.props.selectedSlot.start
        },
        endDate: {
          value: this.props.selectedSlot.end
        },
        startTime: {
          value: moment().hour(0).minute(0)
        },
        endTime: {
          value: moment().hour(0).minute(15)
        }
      }
    }

    if (eventSelected) {
      const startDate = new Date(this.props.selectedEvent.start.toDateString());
      const endDate = new Date(this.props.selectedEvent.end.toDateString());
      const startTime = moment().hour(this.props.selectedEvent.start.getHours()).minute(this.props.selectedEvent.start.getMinutes());
      const endTime = moment().hour(this.props.selectedEvent.end.getHours()).minute(this.props.selectedEvent.end.getMinutes());
      
      newState = {
        title: {
          ...this.state.title,
          value: this.props.selectedEvent.title
        },
        desc: {
          value: this.props.selectedEvent.desc
        },
        startDate: {
          value: startDate
        },
        endDate: {
          value: endDate
        },
        startTime: {
          value: startTime
        },
        endTime: {
          value: endTime
        },
      }
    }

    this.setState(newState);
  }

  handleBlur = (validationFunc, event) => {
    const { target: { name } } = event;

    if (
      this.state[name]['validateOnChange'] === false &&
      this.state.submitCalled === false
    ) {
      this.setState(state => ({
        [name]: {
          ...state[name],
          validateOnChange: true,
          error: validationFunc(state[name].value)
        }
      }));
    }
    return;
  }

  handleChange = (validationFunc, event) => {
    const { target: { name, value } } = event;
    
    if (validationFunc === null) { // handle fields without validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value
        }
      }));
    } else {  // handle fields with validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value,
          error: state[name]['validateOnChange'] ? validationFunc(value) : ''
        }
      }));
    }
  }

  handleDayChange = (value, id) => {
    const newState = {
      [id]: {
        value: value
      }
    }

    // update endDate if later startDate is selected
    if (id === 'startDate' && value > this.state.endDate.value) {
      newState.endDate = {
        value: value
      }
    }

    // update startDate if earlier endDate is selected
    if (id === 'endDate' && value < this.state.startDate.value) {
      newState.startDate = {
        value: value
      }
    }

    this.setState(newState);
  }

  handleTimeChange = (value, id) => {
    let newState = {
      [id]: {
        value: value
      }
    }

    if (id === 'startTime' && this.state.endTime.value.isSameOrBefore(value)) {
      newState.endTime = {
        value: value.clone().add(15, 'minutes')
      }
    }

    if (id === 'endTime' && this.state.startTime.value.isSameOrAfter(value)) {
      newState.startTime = {
        value: value.clone().subtract(15, 'minutes')
      }
    }

    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const titleError = validateFields.validateTitle(this.state.title.value);

    if (titleError === false) {
      try {
        const start = this.appendDateToTime(this.state.startDate.value, this.state.startTime.value)
        const end = this.appendDateToTime(this.state.endDate.value, this.state.endTime.value)
        const data = {
          title: this.state.title.value,
          desc: this.state.desc.value,
          start: start,
          end: end
        }

        this.props.createEvent(data).then(this.setState(state => ({
          title: {
            ...state.title,
            validateOnChange: false,
            error: ''
          },
          submitCalled: false
        })));
      } catch (err) {
        this.setState({error: err.response.data});
      }
    } else {
      this.setState(state => ({
        title: {
          ...state.title,
          validateOnChange: true,
          error: titleError
        }
      }));
    }
  }

  appendDateToTime = (date, time) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    time.set('year', year);
    time.set('month', month);
    time.set('date', day);

    return time.toDate();
  }

  handleSave = (event) => {
    event.preventDefault();

    if (this.state.title.error) return;

    const start = this.appendDateToTime(this.state.startDate.value, this.state.startTime.value)
    const end = this.appendDateToTime(this.state.endDate.value, this.state.endTime.value)
    const titleChanged = this.state.title.value !== this.props.selectedEvent.title;
    const descChanged = this.state.desc.value !== this.props.selectedEvent.desc;
    const startChanged = start !== this.props.selectedEvent.start;
    const endChanged = end !== this.props.selectedEvent.end;
    const validChange = titleChanged || descChanged || startChanged || endChanged;

    if (validChange) {
      try {
        const data = {
          _id: this.props.selectedEvent._id,
          title: this.state.title.value,
          desc: this.state.desc.value,
          start,
          end
        }
        const newState = {
          validateTitleOnChange: false,
          titleError: ''
        }

        this.props.updateEvent(data).then(this.setState(newState));
      } catch (err) {
        this.setState({error: err.response.data});
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
      this.setState({error: err.response.data});
    }
  }

  render() {
    const titleError = !!this.state.title.error;
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
              id='title'
              name='title'
              className={`input ${titleError ? "input--fail" : null} `}
              rows='1'
              onChange={event => this.handleChange(validateFields.validateTitle, event)}
              onBlur={event => this.handleBlur(validateFields.validateTitle, event)}
              value={this.state.title.value}
            >
              enter title
            </textarea>
            <div className="text-danger">
              <small>{this.state.title.error}</small>
            </div>
          </Row>

          <Row>
            <label htmlFor='desc'>Event Description</label>
            <textarea
              id='desc'
              name='desc'
              className='input'
              rows='3'
              onChange={event => this.handleChange(null, event)}
              value={this.state.desc.value}
            >
              enter description
            </textarea>
          </Row>

          <Row className='two-column'>
            <Col>
              <label htmlFor='startDate'>Start Date</label>
              <DayPickerInput
                id='startDate'
                name='startDate'
                formatDate={formatDate}
                parseDate={parseDate}
                value={`${formatDate(this.state.startDate.value)}`}
                onDayChange={(value) => this.handleDayChange(value, 'startDate')}
              />
            </Col>

            <Col>
              <label htmlFor='startTime'>Start Time</label>
              <TimePicker
                id='startTime'
                name='startTime'
                showSecond={false}
                value={this.state.startTime.value}
                onChange={(value, id='startTime') => this.handleTimeChange(value, id)}
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
                id='endDate'
                name='endDate'
                formatDate={formatDate}
                parseDate={parseDate}
                value={`${formatDate(this.state.endDate.value)}`}
                onDayChange={(value) => this.handleDayChange(value, 'endDate')}
              />
            </Col>

            <Col>
              <label htmlFor='endTime'>End Time</label>
              <TimePicker
                id='endTime'
                name='endTime'
                showSecond={false}
                value={this.state.endTime.value}
                onChange={(value, id='endTime') => this.handleTimeChange(value, id)}
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