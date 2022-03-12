import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { _ } from 'core-js';

import CalendarSettingsItem from './CalendarSettingsItem';
import { validateFields } from '../../validation';
import { createCalendar, updateCalendar } from '../store/userSlice';

import '../styles/CalendarSettings.css';

const initialState = {
  newCalendar: {
    value: '',
    validateOnChange: false,
    error: ''
  }
};
class CalendarSettings extends Component {
  constructor(props) {
    super(props);

    const calendarsState = this.getCalendarsState();

    this.state = {
      newCalendar: {
        ...initialState.newCalendar
      },
      ...calendarsState
    };
  }

  componentDidUpdate = (prevProps) => {
    const isCalendarsUpdated = !_.isEqual(this.props.calendars, prevProps.calendars);

    // Reset newCalendar state when any calendar is added or updated
    if (isCalendarsUpdated) {
      const calendarsState = this.getCalendarsState();

      this.setState({
        newCalendar: {
          ...initialState.newCalendar
        },
        ...calendarsState
      });
    }
  };

  getCalendarsState = () => {
    let calendarsState = {};

    this.props.calendars.forEach((calendar) => {
      const calendarId = calendar.id;
      const calendarState = {
        value: calendar.name,
        systemCalendar: calendar.systemCalendar,
        userDefault: calendar.userDefault,
        validateOnChange: false,
        error: '',
        editMode: false
      };
      calendarsState[calendarId] = calendarState;
    });

    return calendarsState;
  };

  handleBlur = (validationFunc, event) => {
    const {
      target: { name }
    } = event;

    if (!this.state[name]) return;

    if (this.state[name]['validateOnChange'] === false) {
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

    if (!this.state[name]) return;

    let newState = {
      [name]: {
        ...this.state[name],
        value: value,
        error: this.state[name]['validateOnChange'] ? validationFunc(value) : ''
      }
    };

    this.setState(newState);
  };

  handleEdit = (id) => {
    if (!id || !this.state[id]) return;

    let newState = {};

    newState[id] = {
      ...this.state[id],
      editMode: true
    };

    this.setState(newState);
  };

  handleCancel = (id) => {
    if (!id) return;

    // Reset component state to match app state
    const calendar = this.props.calendars.filter((calendar) => calendar.id === id); // returns array of length 1

    let newState = {
      value: calendar[0].name,
      validateOnChange: false,
      error: '',
      editMode: false
    };

    this.setState({
      [id]: newState
    });
  };

  handleSubmitAddCalendar = (event) => {
    event.preventDefault();

    const { newCalendar } = this.state;

    const newCalendarError = validateFields.validateCalendarName(newCalendar.value.trim());

    if (newCalendarError === false) {
      // no input errors, submit the form
      const data = {
        name: newCalendar.value.trim(),
        userId: this.props.userId
      };

      this.props
        .createCalendar(data)
        .then(() => {
          this.setState({
            newCalendar: {
              ...initialState.newCalendar
            }
          });
          alert('New calendar created!');
        })
        .catch((err) => {
          const error = err.response ? err.response.data : err;
          alert(`Error creating calendar: ${error.message}`);
          if (error.errorCode === 'calendar') {
            this.setState((state) => ({
              newCalendar: {
                ...state.newCalendar,
                error: error.message
              }
            }));
          }
        });
    } else {
      // update state with input error
      this.setState((state) => ({
        newCalendar: {
          ...state.newCalendar,
          validateOnChange: true,
          error: newCalendarError
        }
      }));
    }
  };

  handleSubmitUpdateCalendar = (event, id) => {
    event.preventDefault();

    if (!this.state[id]) return;

    const calendarState = this.state[id];

    // Check for unchanged input
    const calendarName = this.props.calendars
      .filter((calendar) => calendar.id === id)
      .map((calendar) => calendar.name)[0];

    if (calendarState.value === calendarName) {
      alert('No changes detected!');
      return;
    }

    // Validate input
    const calendarNameError = validateFields.validateCalendarName(calendarState.value.trim());

    if (calendarNameError === false) {
      // no input errors, submit the form
      try {
        const data = {
          calendarId: id,
          name: calendarState.value.trim()
        };

        this.props.updateCalendar(data);
        alert(`Successfully updated calendar: "${data.name}"`);
      } catch (err) {
        const error = err.response ? err.response.data : err;
        alert(`Error updating calendar: ${error.message}`);
        if (error.errorCode === 'calendarName') {
          this.setState((state) => ({
            [id]: {
              ...state[id],
              error: error.message
            }
          }));
        }
      }
    } else {
      // update state with input error
      this.setState((state) => ({
        [id]: {
          ...state[id],
          validateOnChange: true,
          error: calendarNameError
        }
      }));
    }
  };

  render() {
    return (
      <Form className="CalendarSettings">
        {this.props.calendars.map((calendar) => (
          <CalendarSettingsItem
            key={calendar.id}
            id={calendar.id}
            type="text"
            value={this.state[calendar.id].value}
            isDefault={this.state[calendar.id].userDefault}
            error={this.state[calendar.id] ? this.state[calendar.id].error : null}
            editMode={this.state[calendar.id] ? this.state[calendar.id].editMode : false}
            disabled={this.state[calendar.id] ? this.state[calendar.id].systemCalendar : true}
            onChange={(event) => this.handleChange(validateFields.validateCalendarName, event)}
            onBlur={(event) => this.handleBlur(validateFields.validateCalendarName, event)}
            onSubmit={(event, id) => this.handleSubmitUpdateCalendar(event, id)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)}
          />
        ))}

        <CalendarSettingsItem
          id="newCalendar"
          type="text"
          label="Add Calendar"
          placeholder="Enter calendar name"
          value={this.state.newCalendar.value}
          error={this.state.newCalendar.error}
          editMode={true}
          onChange={(event) => this.handleChange(validateFields.validateCalendarName, event)}
          onSubmit={(event) => this.handleSubmitAddCalendar(event)}
        />
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    calendars: state.user.calendars
  };
};

const mapActionsToProps = {
  createCalendar,
  updateCalendar
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarSettings);
