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
  constructor(...args) {
    super(...args);
    this.state = initialState;
  }

  componentDidMount = () => {
    this.updateCalendarsState();
  };

  componentDidUpdate = (prevProps) => {
    const calendarsChanged = this.props.calendars.length > 0 && !_.isEqual(this.props.calendars, prevProps.calendars);
    if (calendarsChanged) {
      this.updateCalendarsState();
    }
  };

  updateCalendarsState = () => {
    if (!this.props.calendars.length) return;

    let newState = {};

    this.props.calendars.forEach((calendar) => {
      let calendarId = calendar._id;
      let newObj = {
        value: calendar.name,
        validateOnChange: false,
        error: '',
        editMode: false
      };
      newState[calendarId] = newObj;
    });

    this.setState(newState);
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

    if (this.props.calendars.length) {
      this.updateCalendarsState();
    }
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
    const calendarsLoaded = _.size(this.state) > this.props.calendars.length;

    return (
      <div className="CalendarSettings">
        <Form>
          <Container>
            <Row>
              <Col>
                <div className="heading text-primary">
                  <h4>Calendar Settings</h4>
                </div>
              </Col>
            </Row>
          </Container>

          {calendarsLoaded &&
            this.props.calendars.map((item) => (
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
            value={this.state.newCalendar.value}
            editMode="true"
            error={this.state.newCalendar.error}
            onChange={(event) => this.handleChange(validateFields.validateCalendarName, event)}
            onBlur={(event) => this.handleBlur(validateFields.validateCalendarName, event)}
            onSubmit={(event) => this.handleSubmitAddCalendar(event)}
          />
        </Form>
      </div>
    );
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
