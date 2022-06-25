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
} from '../../store/userSlice';
import { validateFields } from '../../../validation.js';

import './CalendarEventForm.css';
import 'react-day-picker/lib/style.css';
import 'rc-time-picker/assets/index.css';

class CalendarEventForm extends Component {
  constructor(props) {
    super(props);

    const defaultCalendarId = this.props.calendars.filter((calendar) => calendar.userDefault === true)[0].id;

    const { calendarSlot } = this.props.calendarSelectionWithSlotAndEvent;

    const initialState = {
      title: {
        value: '',
        validateOnChange: false,
        error: null
      },
      desc: {
        value: ''
      },
      start: {
        value: calendarSlot.start
      },
      end: {
        value: calendarSlot.end
      },
      allDay: false,
      defaultCalendarId: defaultCalendarId,
      selectedCalendarId: defaultCalendarId,
      submitCalled: false,
      timeFormat: 'h:mm a',
      error: null
    };

    this.state = initialState;
  }

  componentDidUpdate = (prevProps) => {
    if (!this.props.calendarSelectionWithSlotAndEvent) {
      return;
    }

    // Check if app state updated calendar selection (via memoized selector)
    const isCalendarSelectionUpdated = !_.isEqual(
      prevProps.calendarSelectionWithSlotAndEvent,
      this.props.calendarSelectionWithSlotAndEvent
    );

    if (!isCalendarSelectionUpdated) {
      return;
    }

    // Prepare component state update
    let newState = {
      title: {
        validateOnChange: false,
        error: null
      },
      desc: {},
      start: {},
      end: {},
      submitCalled: false,
      error: null
    };

    // Check if current selection is a slot or event
    const { calendarEvent, calendarSlot } = this.props.calendarSelectionWithSlotAndEvent;
    const isEventSelected = Object.keys(calendarEvent).length > 0;
    const isSlotSelected = Object.keys(calendarSlot).length > 0;

    if (isEventSelected) {
      newState.title.value = calendarEvent.title;
      newState.desc.value = calendarEvent.desc;
      newState.start.value = calendarEvent.start;
      newState.end.value = calendarEvent.end;
      newState.allDay = calendarEvent.allDay;
      newState.selectedCalendarId = calendarEvent.calendarId;
    } else if (isSlotSelected) {
      // Set title and desc depending on previous selection
      const isPrevSelectionASlot = !!prevProps.calendarSelectionWithSlotAndEvent;

      if (isPrevSelectionASlot) {
        newState.title.value = this.state.title.value;
        newState.desc.value = this.state.desc.value;
      } else {
        // previous selection was an event
        newState.title.value = '';
        newState.desc.value = '';
      }

      // Set start date, end date, and allDay flag depending on calendar view
      const calendarView = this.props.calendarView;

      if (calendarView === 'month') {
        // single day slot
        if (calendarSlot.action === 'click') {
          let startDate = new Date(calendarSlot.start);
          startDate.setHours(12);
          const startDateISO = startDate.toISOString();

          let endDate = new Date(calendarSlot.end);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(13);
          const endDateISO = endDate.toISOString();

          newState.start.value = startDateISO;
          newState.end.value = endDateISO;
          newState.allDay = false;
        }
        // multi day slot
        if (calendarSlot.action === 'select') {
          newState.start.value = calendarSlot.start;
          newState.end.value = calendarSlot.end;
          newState.allDay = true;
        }
      }

      if (calendarView === 'week' || calendarView === 'day') {
        newState.start.value = calendarSlot.start;
        newState.end.value = calendarSlot.end;

        // single or multi day slot
        if (Object.prototype.hasOwnProperty.call(calendarSlot, 'box')) {
          newState.allDay = false;
        } else {
          // all day slot
          newState.allDay = true;
        }
      }

      // Set default calendar ID if previous selection was from system calendar
      const prevCalendar = this.props.calendars.filter((calendar) => calendar.id === this.state.selectedCalendarId)[0];

      if (prevCalendar.systemCalendar) {
        newState.selectedCalendarId = this.state.defaultCalendarId;
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
          error: state[name]['validateOnChange'] ? validationFunc(value) : null
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

      // Check for valid end time
      if (this.state.allDay === false && this.state.end.value <= this.state.start.value) {
        alert('Input error: End time should be after start time!');
        return;
      }

      let data = {
        title: this.state.title.value,
        desc: this.state.desc.value,
        allDay: this.state.allDay,
        calendarId: this.state.selectedCalendarId
      };

      // add start and end values
      if (this.state.allDay === true) {
        let startTimeAsDateObj = new Date(this.state.start.value);
        let endTimeAsDateObj = new Date(this.state.end.value);

        // Set hours, minutes, and seconds to zero
        startTimeAsDateObj.setHours(0, 0, 0);
        endTimeAsDateObj.setHours(0, 0, 0);

        const allDayStartTimeAsISOString = startTimeAsDateObj.toISOString();
        const allDayEndTimeAsISOString = endTimeAsDateObj.toISOString();

        data.start = allDayStartTimeAsISOString;
        data.end = allDayEndTimeAsISOString;
      } else {
        data.start = this.state.start.value;
        data.end = this.state.end.value;
      }

      if (clickedId === 'add-event-btn') {
        // Dispatch createCalendarEvent action
        this.props
          .createCalendarEvent(data)
          .then(() => {
            alert(`Successfully added new event: "${data.title}"`);
          })
          .catch((err) => {
            const error = err.response ? err.response.data : err;
            alert(`Error creating event: ${error}`);
            this.setState({ error: error.message });
          });
      }

      if (clickedId === 'update-event-btn') {
        data.id = this.props.calendarSelectionWithSlotAndEvent.calendarEvent.id;

        // Check for valid event update
        const { calendarEvent } = this.props.calendarSelectionWithSlotAndEvent;

        const isEventUpdateValid = this.checkEventUpdate(calendarEvent, data);

        if (!isEventUpdateValid) {
          alert('No changes detected!');
          return;
        }

        // If update is valid, dispatch updateCalendarEvent action
        this.props
          .updateCalendarEvent(data)
          .then(() => {
            alert(`Successfully updated event: "${data.title}"`);
          })
          .catch((err) => {
            const error = err.response ? err.response.data : err;
            alert(`Error updating event: ${error}`);
            this.setState({ error: error.message });
          });
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

  checkEventUpdate = (event, update) => {
    const isUpdateValid =
      event.id == update.id &&
      (event.title != update.title ||
        event.desc != update.desc ||
        event.start != update.start ||
        event.end != update.end ||
        event.allDay != update.allDay ||
        event.calendarId != update.calendarId);

    if (isUpdateValid) {
      return true;
    }
    return false;
  };

  handleDelete = (event) => {
    event.preventDefault();
    if (!this.props.calendarSelectionWithSlotAndEvent.calendarEvent) return;

    // Confirm delete via user input
    const deleteConfirmation = confirm('Are you sure you want to delete this event?');
    if (deleteConfirmation === false) return;

    const eventId = this.props.calendarSelectionWithSlotAndEvent.calendarEvent.id;

    this.props.deleteCalendarEvent(eventId).catch((err) => {
      const error = err.response ? err.response.data : err;
      alert(`Error deleting calendar: ${error}`);
      this.setState({ error: error.message });
    });
  };

  handleCalendarChange = (values) => {
    const calendarId = values[0].id;
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
    const selectedCalendar = this.props.calendars.filter(
      (calendar) => calendar.id === this.state.selectedCalendarId
    )[0];
    const isSystemEventSelected = selectedCalendar.systemCalendar;
    const isSlotSelected = this.props.calendarSelectionWithSlotAndEvent
      ? Object.keys(this.props.calendarSelectionWithSlotAndEvent.calendarSlot).length > 0
      : false;

    return (
      <Form className="CalendarEventForm">
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
              value={this.state.title.value}
              onChange={(event) => this.handleChange(validateFields.validateTitle, event)}
              onBlur={(event) => this.handleBlur(validateFields.validateTitle, event)}
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
              rows="6"
              value={this.state.desc.value}
              onChange={(event) => this.handleChange(null, event)}
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
                  format={this.state.timeFormat}
                  minuteStep={15}
                  use12Hours
                  inputReadOnly
                  value={this.state.allDay ? this.placeholder : moment(this.state.start.value)}
                  onChange={(value, id = 'startTime') => this.handleTimeChange(value, id)}
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
                  format={this.state.timeFormat}
                  minuteStep={15}
                  use12Hours
                  inputReadOnly
                  value={this.state.allDay ? this.placeholder : moment(this.state.end.value)}
                  onChange={(value, id = 'endTime') => this.handleTimeChange(value, id)}
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
              selected={selectedCalendar ? [selectedCalendar] : []}
              disabled={isSystemEventSelected}
              onChange={(values) => this.handleCalendarChange(values)}
            />
          </Col>
        </Row>

        <Row className="two-column">
          <Col>
            {isSlotSelected && (
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
                Add
              </Button>
            )}
            {!isSlotSelected && (
              <Button
                type="submit"
                name="update-event-btn"
                id="update-event-btn"
                className="btn"
                variant="success"
                disabled={isSystemEventSelected}
                onClick={(e) => this.handleSubmit(e, this.id)}
              >
                Save
              </Button>
            )}
          </Col>

          <Col>
            {!isSlotSelected && (
              <Button
                name="delete-event-btn"
                id="delete-event-btn"
                className="btn"
                variant="danger"
                disabled={isSystemEventSelected}
                onClick={this.handleDelete}
              >
                Delete
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    calendars: state.user.calendars,
    calendarView: state.user.calendarViewSelection,
    calendarSelectionWithSlotAndEvent: calendarSelectionWithSlotAndEvent(state)
  };
};

const mapActionsToProps = {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarEventForm);