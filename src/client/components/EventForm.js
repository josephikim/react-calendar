import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

import CalendarSelectMenu from './CalendarSelectMenu';

import { createEvent, updateEvent, deleteEvent } from '../actions/userActions';
import { validateFields } from '../../validation.js';

import '../styles/EventForm.css';
import 'react-day-picker/lib/style.css';
import 'rc-time-picker/assets/index.css';

const initialState = {
  title: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  desc: {
    value: ''
  },
  start: {
    value: ''
  },
  end: {
    value: ''
  },
  formValuesChanged: false,
  submitCalled: false,
  timeFormat: 'h:mm a',
  error: ''
}
class EventForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  componentDidMount = () => {
    if (!this.props.selectedSlot) return;

    // Initialize state with selected slot
    const newState = {
      start: {
        value: this.props.selectedSlot.start
      },
      end: {
        value: this.props.selectedSlot.end
      }
    }
    
    this.setState(newState)
  }

  componentDidUpdate = (prevProps) => {
    const slotSelected = Object.keys(this.props.selectedSlot).length > 0;
    const eventSelected = Object.keys(this.props.selectedEvent).length > 0;

    const slotUnchanged = _.isEqual(this.props.selectedSlot, prevProps.selectedSlot);
    const eventUnchanged = _.isEqual(this.props.selectedEvent, prevProps.selectedEvent);

    if (slotUnchanged && eventUnchanged) return;

    let newState = {};

    if (slotSelected) {
      if (eventUnchanged) {  // previous selection was a slot
        newState = {
          ...initialState,
          title: {
            ...initialState.title,
            value: this.state.title.value
          },
          desc: {
            value: this.state.desc.value
          },
          start: {
            value: this.props.selectedSlot.start
          },
          end: {
            value: this.props.selectedSlot.end
          }
        }
      } else {  // previous selection was an event
        newState = {
          ...initialState,
          start: {
            value: this.props.selectedSlot.start
          },
          end: {
            value: this.props.selectedSlot.end
          }
        }
      }
    }

    if (eventSelected) {
      if (eventUnchanged) return;

      newState = {
        ...initialState,
        title: {
          ...initialState.title,
          value: this.props.selectedEvent.title,
        },
        desc: {
          value: this.props.selectedEvent.desc
        },
        start: {
          value: this.props.selectedEvent.start
        },
        end: {
          value: this.props.selectedEvent.end
        }
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
        },
        formValuesChanged: true,
      }));
    } else {  // handle fields with validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value,
          error: state[name]['validateOnChange'] ? validationFunc(value) : ''
        },
        formValuesChanged: true,
      }));
    }
  }

  handleDayChange = (onDayChangeValue, id) => {
    const target = id.startsWith('start') ? 'start' : 'end';
    let updateValue = new Date(onDayChangeValue);
    let targetValue = new Date(this.state[target].value)

    // Update day, month, year of target value
    const [year, month, day] = [updateValue.getFullYear(), updateValue.getMonth(), updateValue.getDate()];
    targetValue.setFullYear(year, month, day);

    const targetValueStr = targetValue.toISOString();

    let newState = {
      [target]: {
        value: targetValueStr
      },
      formValuesChanged: true
    }

    // update end date if later start date is selected
    if (target === 'start' && targetValueStr > this.state.end.value) {
      let endDate = new Date(this.state.end.value)
      endDate.setFullYear(year, month, day)

      newState.end = {
        value: endDate.toISOString()
      }
    }

    // update start date if earlier end date is selected
    if (target === 'end' && targetValueStr < this.state.start.value) {
      let startDate = new Date(this.state.start.value)
      startDate.setFullYear(year, month, day)

      newState.start = {
        value: startDate.toISOString()
      }
    }

    this.setState(newState);
  }

  handleTimeChange = (onChangeValue, id) => {
    const target = id.startsWith('start') ? 'start' : 'end';
    const updateStr = onChangeValue._d.toISOString();

    let newState = {
      [target]: {
        value: updateStr
      },
      formValuesChanged: true
    }

    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const titleError = validateFields.validateTitle(this.state.title.value);

    if (titleError === false) {
      try {
        if (this.state.end.value <= this.state.start.value) { // Check for invalid end time
          alert('Input error: End time should be after start time!')
          return
        }

        const data = {
          title: this.state.title.value,
          desc: this.state.desc.value,
          start: this.state.start.value,
          end: this.state.end.value
        }

        this.props.createEvent(data);
      } catch (err) {
        this.setState({ error: err.response.data });
      }
    } else {
      this.setState(state => ({
        title: {
          ...state.title,
          validateOnChange: true,
          error: titleError
        },
        submitCalled: false
      }));
    }
  }

  handleSave = (event) => {
    event.preventDefault();
    if (this.state.title.error) return;

    if (this.state.end.value <= this.state.start.value) { // Check for invalid end time
      alert('End time should be after start time')
      return
    }

    try {
      const data = {
        _id: this.props.selectedEvent._id,
        title: this.state.title.value,
        desc: this.state.desc.value,
        start: this.state.start.value,
        end: this.state.end.value
      }

      this.props.updateEvent(data);
    } catch (err) {
      this.setState({ error: err.response.data });
    }
  }

  handleDelete = (event) => {
    event.preventDefault();
    if (!this.props.selectedEvent) return;

    const eventId = this.props.selectedEvent._id;

    try {
      this.props.deleteEvent(eventId);
    } catch (err) {
      this.setState({ error: err.response.data });
    }
  }

  render() {
    const slotSelected = Object.keys(this.props.selectedSlot).length > 0;
    const eventSelected = Object.keys(this.props.selectedEvent).length > 0;
    const formValuesChanged = this.state.formValuesChanged;
    return (
      <div className='EventForm'>
        <Form>
          <Row>
            <Col>
              <label htmlFor='title' className='text-primary'>Event Title (required)</label>

              <textarea
                id='title'
                name='title'
                className='input'
                rows='1'
                onChange={event => this.handleChange(validateFields.validateTitle, event)}
                onBlur={event => this.handleBlur(validateFields.validateTitle, event)}
                value={this.state.title.value}
              >
                enter title
              </textarea>

              <div className='text-danger'>
                <small>{this.state.title.error}</small>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <label htmlFor='desc' className='text-primary'>Event Description</label>

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
            </Col>
          </Row>

          <Row className='two-column'>
            <Col xs={6}>
              <Row>
                <Col>
                  <label htmlFor='startDate' className='text-primary'>Start Date</label>

                  <DayPickerInput
                    id='startDate'
                    name='startDate'
                    formatDate={formatDate}
                    parseDate={parseDate}
                    value={`${formatDate(this.state.start.value)}`}
                    onDayChange={(value) => this.handleDayChange(value, 'startDate')}
                  />
                </Col>
              </Row>
            </Col>

            <Col xs={6}>
              <Row>
                <Col>
                  <label htmlFor='startTime' className='text-primary'>Start Time</label>

                  <TimePicker
                    id='startTime'
                    name='startTime'
                    showSecond={false}
                    value={moment(this.state.start.value)}
                    onChange={(value, id = 'startTime') => this.handleTimeChange(value, id)}
                    format={this.state.timeFormat}
                    minuteStep={15}
                    use12Hours
                    inputReadOnly
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='two-column'>
            <Col xs={6}>
              <Row>
                <Col>
                  <label htmlFor='endDate' className='text-primary'>End Date</label>

                  <DayPickerInput
                    id='endDate'
                    name='endDate'
                    formatDate={formatDate}
                    parseDate={parseDate}
                    value={`${formatDate(this.state.end.value)}`}
                    onDayChange={(value) => this.handleDayChange(value, 'endDate')}
                  />
                </Col>
              </Row>
            </Col>

            <Col xs={6}>
              <Row>
                <Col>
                  <label htmlFor='endTime' className='text-primary'>End Time</label>

                  <TimePicker
                    id='endTime'
                    name='endTime'
                    showSecond={false}
                    value={moment(this.state.end.value)}
                    onChange={(value, id = 'endTime') => this.handleTimeChange(value, id)}
                    format={this.state.timeFormat}
                    minuteStep={15}
                    use12Hours
                    inputReadOnly
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='two-column'>
            <Col>
              {slotSelected &&
                <Button
                  type='submit'
                  name='add-event-btn'
                  id='add-event-btn'
                  className='btn'
                  variant='primary'
                  onMouseDown={() => this.setState({ submitCalled: true })}
                  onClick={this.handleSubmit}
                >
                  Add Event
                </Button>
              }
              {eventSelected &&
                <Button
                  name='save-changes-btn'
                  id='save-changes-btn'
                  className='btn'
                  variant='success'
                  disabled={!formValuesChanged}
                  onClick={this.handleSave}
                >
                  Save Changes
                </Button>
              }
            </Col>

            <Col>
              {eventSelected &&
                <Button
                  name='delete-event-btn'
                  id='delete-event-btn'
                  className='btn'
                  variant='danger'
                  onClick={this.handleDelete}
                >
                  Delete Event
                </Button>
              }
            </Col>
          </Row>

          <Row>
            <Col>
              <CalendarSelectMenu />
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedSlot: state.user.selectedSlot,
    selectedEvent: state.user.selectedEvent
  };
};

const mapActionsToProps = {
  createEvent,
  updateEvent,
  deleteEvent
}

export default connect(mapStateToProps, mapActionsToProps)(EventForm);