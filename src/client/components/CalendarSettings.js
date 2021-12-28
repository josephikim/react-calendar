import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { validateFields } from '../../validation';
import { createCalendar, updateCalendar } from '../store/userSlice';

import CalendarSettingsItem from './CalendarSettingsItem';

import { _ } from 'core-js';

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
    const calendarsChanged = this.props.calendars.length > 0 && !_.isEqual(this.props.calendars, prevProps.calendars);

    if (calendarsChanged) {
      const calendarsState = getCalendarsState();

      this.setState({
        newCalendar: {
          ...initialState.newCalendar
        },
        ...calendarsState
      });
    }
  };

  getCalendarsState = () => {
    if (!this.props.calendars.length) return;

    let calendarsState = {};

    this.props.calendars.forEach((calendar) => {
      let calendarId = calendar._id;
      let newObj = {
        value: calendar.name,
        validateOnChange: false,
        error: '',
        editMode: false
      };
      calendarsState[calendarId] = newObj;
    });

    return calendarsState;
  };

  handleBlur = (validationFunc, event) => {
    const {
      target: { name }
    } = event;

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
    if (!id) return;

    let newState = {};

    (newState[id] = {
      ...this.state[id],
      editMode: true
    }),
      this.setState(newState);
  };

  handleCancel = (id) => {
    if (!id) return;

    // revert component state obj to match app state
    const calendar = this.props.calendars.filter((calendar) => calendar._id === id); // returns array of length 1

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
          const error = err.response.data;
          if (error.errorCode === 'calendar') {
            this.setState((state) => ({
              newCalendar: {
                ...state.newCalendar,
                error: error.message
              }
            }));
          } else {
            alert(`Error: ${error.message}`);
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

    const calendarState = this.state[id];

    const calendarNameError = validateFields.validateCalendarName(calendarState.value.trim());

    if (calendarNameError === false) {
      // no input errors, submit the form
      const data = {
        _id: id,
        name: calendarState.value.trim()
      };

      this.props.updateCalendar(data).catch((err) => {
        const error = err.response.data;

        if (error.errorCode === 'calendarName') {
          this.setState((state) => ({
            [id]: {
              ...state[id],
              error: error.message
            }
          }));
        } else {
          alert(`Error: ${error.message}`);
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
    const calendarsLoaded = this.props.calendars.length > 0;
    const newCalendarError = this.state.newCalendar.error;

    if (calendarsLoaded) {
      return (
        <div className="CalendarSettings">
          <Form>
            {this.props.calendars.map((item) => (
              <CalendarSettingsItem
                key={item._id}
                id={item._id}
                type="text"
                value={this.state[item._id].value}
                editMode={this.state[item._id].editMode}
                error={this.state[item._id].error}
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
              editMode="true"
              value={this.state.newCalendar.value}
              error={this.state.newCalendar.error}
              onChange={(event) => this.handleChange(validateFields.validateCalendarName, event)}
              onBlur={(event) => this.handleBlur(validateFields.validateCalendarName, event)}
              onSubmit={(event) => this.handleSubmitAddCalendar(event)}
            />

            {newCalendarError && (
              <Container>
                <div className="error text-danger">
                  <small>{newCalendarError}</small>
                </div>
              </Container>
            )}
          </Form>
        </div>
      );
    } else {
      return (
        <>
          <Container>
            <h4>No Calendars Found!</h4>
          </Container>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.userId,
    calendars: state.user.calendars
  };
};

const mapActionsToProps = {
  createCalendar,
  updateCalendar
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarSettings);
