import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import _ from 'lodash';

import AccountCalendarSettingsItem from './AccountCalendarSettingsItem';
import { validateFields } from '../../../validation';
import { createCalendar, updateCalendar, deleteCalendar } from '../../store/userSlice';

import './AccountCalendarSettings.css';

const initialState = {
  newCalendar: {
    value: '',
    validateOnChange: false,
    error: null
  }
};
class AccountCalendarSettings extends Component {
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

    // Reset component state when any calendar is added or updated
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
      const id = calendar.id;
      const calendarState = {
        value: calendar.name,
        validateOnChange: false,
        error: null,
        editMode: false
      };
      calendarsState[id] = calendarState;
    });

    return calendarsState;
  };

  handleBlur = (validationFunc, event) => {
    const {
      target: { id }
    } = event;

    if (!this.state[id]) return;

    if (this.state[id].validateOnChange === false) {
      this.setState((state) => ({
        [id]: {
          ...state[id],
          validateOnChange: true,
          error: validationFunc(state[id].value)
        }
      }));
    }
    return;
  };

  handleChange = (validationFunc, event) => {
    const {
      target: { id, value }
    } = event;

    if (!this.state[id]) return;

    const newState = {
      [id]: {
        ...this.state[id],
        value: value,
        error: this.state[id].validateOnChange ? validationFunc(value) : null
      }
    };

    this.setState(newState);
  };

  handleEdit = (id) => {
    if (!this.state[id]) return;

    let newState = {};

    newState[id] = {
      ...this.state[id],
      editMode: true
    };

    this.setState(newState);
  };

  handleCancel = (id) => {
    if (!id) return;

    // Reset component calendar state to match app state
    const calendar = this.props.calendars.filter((calendar) => calendar.id === id)[0];

    let newState = {
      ...this.state[id],
      value: calendar.name,
      validateOnChange: false,
      error: null,
      editMode: false
    };

    this.setState({
      [id]: newState
    });
  };

  handleDeleteCalendar = (id) => {
    // Check if calendar is valid for deletion
    const calendar = this.props.calendars.filter((calendar) => calendar.id === id)[0];

    const isValidCalendar = !calendar.systemCalendar && !calendar.userDefault;

    if (isValidCalendar) {
      this.props
        .deleteCalendar(id)
        .then(() => {
          alert(`Calendar "${calendar.name}" deleted!`);
        })
        .catch((err) => {
          const error = err.response ? err.response.data : err;
          alert(`Error deleting calendar: ${error.message}`);
        });
    }
  };

  handleAddCalendar = (event) => {
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
          alert('New calendar created!');
        })
        .catch((err) => {
          const error = err.response ? err.response.data : err;
          alert(`Error creating calendar: ${error.message}`);
          if (error.errorCode && error.errorCode === 'calendar') {
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

  handleUpdateCalendar = (event, id) => {
    event.preventDefault();

    const calendarState = this.state[id];

    // Check for valid input
    const calendarName = this.props.calendars
      .filter((calendar) => calendar.id === id)
      .map((calendar) => calendar.name)[0];

    if (calendarState.value === calendarName) {
      alert('No change detected!');
      return;
    }

    // Validate input
    const calendarNameError = validateFields.validateCalendarName(calendarState.value.trim());

    if (calendarNameError === false) {
      // no input errors, submit the form

      const data = {
        calendarId: id,
        name: calendarState.value.trim()
      };

      this.props
        .updateCalendar(data)
        .then(() => {
          alert(`Successfully updated calendar: "${data.name}"`);
        })
        .catch((err) => {
          const error = err.response ? err.response.data : err;
          alert(`Error updating calendar: ${error.message}`);
          if (error.errorCode && error.errorCode === 'calendarName') {
            this.setState((state) => ({
              [id]: {
                ...state[id],
                error: error.message
              }
            }));
          }
        });
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
    const isCalendarsLoaded = this.props.calendars.length > 0;

    if (isCalendarsLoaded) {
      return (
        <Form className="AccountCalendarSettings">
          {this.props.calendars.map((calendar) => (
            <AccountCalendarSettingsItem
              key={calendar.id}
              id={calendar.id}
              type="text"
              value={this.state[calendar.id] ? this.state[calendar.id].value : calendar.name}
              isSystemCalendar={calendar.systemCalendar}
              isDefaultCalendar={calendar.userDefault}
              error={this.state[calendar.id] ? this.state[calendar.id].error : null}
              editMode={this.state[calendar.id] ? this.state[calendar.id].editMode : false}
              onChange={(event) => this.handleChange(validateFields.validateCalendarName, event)}
              onBlur={(event) => this.handleBlur(validateFields.validateCalendarName, event)}
              onSubmit={(event, id) => this.handleUpdateCalendar(event, id)}
              onDelete={(id) => this.handleDeleteCalendar(id)}
              onEdit={(id) => this.handleEdit(id)}
              onCancel={(id) => this.handleCancel(id)}
            />
          ))}

          <AccountCalendarSettingsItem
            id="newCalendar"
            type="text"
            label="Add Calendar"
            placeholder="Enter calendar name"
            value={this.state.newCalendar.value}
            error={this.state.newCalendar.error}
            editMode={true}
            onChange={(event) => this.handleChange(validateFields.validateCalendarName, event)}
            onSubmit={(event) => this.handleAddCalendar(event)}
          />
        </Form>
      );
    } else {
      return <div>No calendars found...</div>;
    }
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
  updateCalendar,
  deleteCalendar
};

export default connect(mapStateToProps, mapActionsToProps)(AccountCalendarSettings);