import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

import CalendarSelectMenu from './CalendarSelectMenu';

import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  calendarSelectionWithSlotAndEvent
} from '../store/userSlice';
import { validateFields } from '../../validation.js';

import '../styles/EventForm.css';
import 'react-day-picker/lib/style.css';
import 'rc-time-picker/assets/index.css';

class EventForm extends Component {
  constructor(props) {
    super(props);

    let defaultCalendarId = null;

    const defaultCalendar = this.props.calendars.filter((calendar) => calendar.userDefault === true); // returns array of length one

    defaultCalendarId = defaultCalendar[0]._id;

    const { calendarSlotSelection } = this.props.calendarSelectionWithSlotAndEvent;

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
        value: calendarSlotSelection.start
      },
      end: {
        value: calendarSlotSelection.end
      },
      allDay: false,
      defaultCalendarId: defaultCalendarId,
      selectedCalendarId: defaultCalendarId,
      submitCalled: false,
      timeFormat: 'h:mm a',
      error: ''
    };

    this.state = initialState;
  }

  componentDidUpdate = (prevProps) => {
    if (!this.props.calendarSelectionWithSlotAndEvent) {
      return;
    }

    const isCalendarSelectionUpdated = !_.isEqual(
      prevProps.calendarSelectionWithSlotAndEvent,
      this.props.calendarSelectionWithSlotAndEvent
    );

    if (!isCalendarSelectionUpdated) {
      return;
    }

    let newState = {
      title: {
        validateOnChange: false,
        error: ''
      },
      submitCalled: false,
      error: ''
    };

    const { calendarEventSelection, calendarSlotSelection } = this.props.calendarSelectionWithSlotAndEvent;
    const isCalendarEventSelected = Object.keys(calendarEventSelection).length > 0;

    if (isCalendarEventSelected) {
      newState.title = {
        ...newState.title,
        value: calendarEventSelection.title
      };
      newState.desc = {
        value: calendarEventSelection.desc
      };
      newState.start = {
        value: calendarEventSelection.start
      };
      newState.end = {
        value: calendarEventSelection.end
      };
      (newState.allDay = calendarEventSelection.allDay),
        (newState.selectedCalendarId = calendarEventSelection.calendarId);
    } else {
      // calendar slot is selected

      // Check for allDay slot selection (only applies to 'week' and 'day' views)
      const isAllDaySlotSelected =
        (calendarSlotSelection.action === 'click' || calendarSlotSelection.action === 'select') &&
        Object.prototype.hasOwnProperty.call(calendarSlotSelection, 'box') === false;

      newState.start = {
        value: calendarSlotSelection.start
      };
      newState.end = {
        value: calendarSlotSelection.end
      };
      newState.allDay = isAllDaySlotSelected;

      const isPrevSelectionASlot = !!prevProps.calendarSelectionWithSlotAndEvent;

      if (isPrevSelectionASlot) {
        newState.title = {
          ...newState.title,
          value: this.state.title.value
        };
        newState.desc = {
          value: this.state.desc.value
        };
      } else {
        // previous selection was an event
        newState.title = {
          ...newState.title,
          value: ''
        };
        newState.desc = {
          value: ''
        };

        const prevSelectionEventCalendar = this.props.calendars.filter(
          (calendar) => calendar._id === this.state.selectedCalendarId
        ); // returns array of length 1
        const isPrevSelectionASystemEvent = prevSelectionEventCalendar[0].systemCalendar === true;

        if (isPrevSelectionASystemEvent) {
          newState.selectedCalendarId = this.state.defaultCalendarId;
        }
      }
    }

    this.setState(newState);
  };

  handleBlur = (validationFunc, event) => {
    const {
      target: { name }
    } = event;

    if (this.state[name]['validateOnChange'] === false && this.state.submitCalled === false) {
      this.setState((state) => ({
        [name]: {
          ...state[name],
          validateOnChange: true,
          error: validationFunc(state[name].value)
        }
      }));
    }
    return;
  };

  handleChange = (validationFunc, event) => {
    const {
      target: { name, value }
    } = event;

    if (validationFunc === null) {
      // handle fields without validation
      this.setState((state) => ({
        [name]: {
          ...state[name],
          value: value
        }
      }));
    } else {
      // handle fields with validation
      this.setState((state) => ({
        [name]: {
          ...state[name],
          value: value,
          error: state[name]['validateOnChange'] ? validationFunc(value) : ''
        }
      }));
    }
  };

  handleDayChange = (onDayChangeValue, id) => {
    const target = id.startsWith('start') ? 'start' : 'end';
    let updateValue = new Date(onDayChangeValue);
    let targetValue = new Date(this.state[target].value);

    // Update day, month, year of target value
    const [year, month, day] = [updateValue.getFullYear(), updateValue.getMonth(), updateValue.getDate()];
    targetValue.setFullYear(year, month, day);

    const targetValueStr = targetValue.toISOString();

    let newState = {
      [target]: {
        value: targetValueStr
      }
    };

    // update end date if later start date is selected
    if (target === 'start' && targetValueStr > this.state.end.value) {
      let endDate = new Date(this.state.end.value);
      endDate.setFullYear(year, month, day);

      newState.end = {
        value: endDate.toISOString()
      };
    }

    // update start date if earlier end date is selected
    if (target === 'end' && targetValueStr < this.state.start.value) {
      let startDate = new Date(this.state.start.value);
      startDate.setFullYear(year, month, day);

      newState.start = {
        value: startDate.toISOString()
      };
    }

    this.setState(newState);
  };

  handleTimeChange = (onChangeValue, id) => {
    const target = id.startsWith('start') ? 'start' : 'end';
    const updateStr = onChangeValue._d.toISOString();

    let newState = {
      [target]: {
        value: updateStr
      }
    };

    this.setState(newState);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const clickedId = event.target.id;
    const titleError = validateFields.validateTitle(this.state.title.value);

    if (titleError === false) {
      // if no error, submit form
      try {
        // Check for valid end time
        if (this.state.allDay === false && this.state.end.value <= this.state.start.value) {
          alert('Input error: End time should be after start time!');
          return;
        }

        let payload = {
          title: this.state.title.value,
          desc: this.state.desc.value,
          allDay: this.state.allDay,
          calendarId: this.state.selectedCalendarId
        };

        // add start and end values to payload
        if (this.state.allDay === true) {
          let startTimeAsDateObj = new Date(this.state.start.value);
          let endTimeAsDateObj = new Date(this.state.end.value);

          // Set hours, minutes, and seconds to zero
          startTimeAsDateObj.setHours(0, 0, 0);
          endTimeAsDateObj.setHours(0, 0, 0);

          const allDayStartTimeAsISOString = startTimeAsDateObj.toISOString();
          const allDayEndTimeAsISOString = endTimeAsDateObj.toISOString();

          payload.start = allDayStartTimeAsISOString;
          payload.end = allDayEndTimeAsISOString;
        } else {
          payload.start = this.state.start.value;
          payload.end = this.state.end.value;
        }

        if (clickedId === 'add-event-btn') {
          // Dispatch createCalendarEvent action
          this.props.createCalendarEvent(payload);
          alert(`Successfully added new event: "${payload.title}"`);
        }

        if (clickedId === 'update-event-btn') {
          // Check for valid event update
          const { calendarEventSelection } = this.props.calendarSelectionWithSlotAndEvent;

          const isEventUpdateValid = this.checkEventUpdate(calendarEventSelection, payload);

          if (!isEventUpdateValid) {
            alert('No changes detected!');
            return;
          }

          // If update is valid, dispatch updateCalendarEvent action
          payload._id = this.props.calendarSelectionWithSlotAndEvent.calendarEventSelection._id;
          this.props.updateCalendarEvent(payload);
          alert(`Successfully updated event: "${payload.title}"`);
        }
      } catch (err) {
        if (err.response) {
          this.setState({ error: err.response.data });
        } else {
          alert(`Error: ${err}`);
        }
      }
    } else {
      this.setState((state) => ({
        title: {
          ...state.title,
          validateOnChange: true,
          error: titleError
        },
        submitCalled: false
      }));
    }
  };

  checkEventUpdate = (event, eventUpdate) => {
    const isUpdateValid =
      event.title !== eventUpdate.title ||
      event.desc !== eventUpdate.desc ||
      event.start !== eventUpdate.start ||
      event.end !== eventUpdate.end ||
      event.allDay !== eventUpdate.allDay ||
      event.calendarId !== eventUpdate.calendarId;

    if (isUpdateValid) {
      return true;
    }
    return false;
  };

  handleDelete = (event) => {
    event.preventDefault();
    if (!this.props.calendarSelectionWithSlotAndEvent.calendarEventSelection) return;

    // Confirm delete via user input
    const deleteConfirmation = confirm('Are you sure you want to delete this event?');
    if (deleteConfirmation === false) return;

    const eventId = this.props.calendarSelectionWithSlotAndEvent.calendarEventSelection._id;

    try {
      this.props.deleteCalendarEvent(eventId);
    } catch (err) {
      this.setState({ error: err.response.data });
    }
  };

  handleCalendarChange = (values) => {
    const calendarId = values[0]._id;
    const isCalendarValueChanged = calendarId !== this.state.selectedCalendarId;

    if (isCalendarValueChanged && calendarId.length > 0) {
      this.setState({
        selectedCalendarId: calendarId
      });
    }
  };

  handleAllDayChange = (event) => {
    const isChecked = event.target.checked;

    if (isChecked !== null) {
      this.setState({
        allDay: isChecked
      });
    }
  };

  render() {
    let isCalendarSlotSelected = true;
    isCalendarSlotSelected = this.props.calendarSelectionWithSlotAndEvent
      ? Object.keys(this.props.calendarSelectionWithSlotAndEvent.calendarSlotSelection).length > 0
      : false;
    const selectedCalendar = this.props.calendars.filter((calendar) => calendar._id === this.state.selectedCalendarId); // returns array of length one
    const isSystemEventSelected = selectedCalendar[0].systemCalendar;
    return (
      <div className="EventForm">
        <Form>
          <Row>
            <Col>
              <label htmlFor="title" className="text-primary">
                Event Title (required)
              </label>

              <textarea
                id="title"
                name="title"
                className="input"
                disabled={isSystemEventSelected}
                rows="1"
                onChange={(event) => this.handleChange(validateFields.validateTitle, event)}
                onBlur={(event) => this.handleBlur(validateFields.validateTitle, event)}
                value={this.state.title.value}
              >
                enter title
              </textarea>

              <div className="text-danger">
                <small>{this.state.title.error}</small>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <label htmlFor="desc" className="text-primary">
                Event Description
              </label>

              <textarea
                id="desc"
                name="desc"
                className="input"
                disabled={isSystemEventSelected}
                rows="3"
                onChange={(event) => this.handleChange(null, event)}
                value={this.state.desc.value}
              >
                enter description
              </textarea>
            </Col>
          </Row>

          <Row className="two-column">
            <Col xs={6}>
              <Row>
                <Col>
                  <label htmlFor="startDate" className="text-primary">
                    Start Date
                  </label>

                  <DayPickerInput
                    id="startDate"
                    name="startDate"
                    inputProps={isSystemEventSelected ? { disabled: true } : {}}
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
                  <label htmlFor="startTime" className="text-primary">
                    Start Time
                  </label>

                  <TimePicker
                    id="startTime"
                    name="startTime"
                    disabled={isSystemEventSelected}
                    placeholder="n/a"
                    showSecond={false}
                    value={this.state.allDay ? this.placeholder : moment(this.state.start.value)}
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

          <Row className="two-column">
            <Col xs={6}>
              <Row>
                <Col>
                  <label htmlFor="endDate" className="text-primary">
                    End Date
                  </label>

                  <DayPickerInput
                    id="endDate"
                    name="endDate"
                    inputProps={isSystemEventSelected ? { disabled: true } : {}}
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
                  <label htmlFor="endTime" className="text-primary">
                    End Time
                  </label>

                  <TimePicker
                    id="endTime"
                    name="endTime"
                    disabled={isSystemEventSelected}
                    placeholder="n/a"
                    showSecond={false}
                    value={this.state.allDay ? this.placeholder : moment(this.state.end.value)}
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

          <Row>
            <Col>
              <label htmlFor="all-day" className="text-primary">
                All Day Event
              </label>

              <Form.Check
                type="checkbox"
                id="all-day"
                checked={this.state.allDay}
                disabled={isSystemEventSelected}
                onChange={(event) => this.handleAllDayChange(event)}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CalendarSelectMenu
                selected={selectedCalendar}
                disabled={isSystemEventSelected}
                calendars={this.props.calendars}
                onChange={(values) => this.handleCalendarChange(values)}
              />
            </Col>
          </Row>

          <Row className="two-column">
            <Col>
              {isCalendarSlotSelected && (
                <Button
                  type="submit"
                  name="add-event-btn"
                  id="add-event-btn"
                  className="btn"
                  variant="primary"
                  disabled={isSystemEventSelected}
                  onMouseDown={() => this.setState({ submitCalled: true })}
                  onClick={(e) => this.handleSubmit(e, this.id)}
                >
                  Add Event
                </Button>
              )}
              {!isCalendarSlotSelected && (
                <Button
                  type="submit"
                  name="update-event-btn"
                  id="update-event-btn"
                  className="btn"
                  variant="success"
                  disabled={isSystemEventSelected}
                  onClick={(e) => this.handleSubmit(e, this.id)}
                >
                  Save Changes
                </Button>
              )}
            </Col>

            <Col>
              {!isCalendarSlotSelected && (
                <Button
                  name="delete-event-btn"
                  id="delete-event-btn"
                  className="btn"
                  variant="danger"
                  disabled={isSystemEventSelected}
                  onClick={this.handleDelete}
                >
                  Delete Event
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    calendars: state.user.calendars,
    calendarSelectionWithSlotAndEvent: calendarSelectionWithSlotAndEvent(state)
  };
};

const mapActionsToProps = {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent
};

export default connect(mapStateToProps, mapActionsToProps)(EventForm);
