import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Form } from 'react-bootstrap';
import { validateFields } from '../../validation';
import { updateUsername, updatePassword } from '../store/userSlice';

import AccountSettingsItem from './AccountSettingsItem';

import '../styles/AccountSettings.css';

const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: '',
    editMode: false
  },
  password: {
    value: '',
    validateOnChange: false,
    editMode: false
  },
  newPassword: {
    value: '',
    validateOnChange: false,
    error: ''
  }
};
class AccountSettings extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount = () => {
    if (!this.props.username) return;

    let newState = {
      username: {
        ...this.state.username,
        value: this.props.username
      },
      password: {
        ...this.state.password,
        value: '****'
      }
    };

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

  handleSubmitUsername = (event) => {
    event.preventDefault();

    const { username } = this.state;
    const usernameError = validateFields.validateUsername(username.value);

    if (usernameError === false) {
      // no input errors, submit the form
      const data = {
        userId: this.props.userId,
        username: username.value
      };

      this.props
        .updateUsername(data)
        .then(() => {
          this.setState({
            username: {
              ...initialState.username,
              value: this.props.username
            }
          });
          alert('Username updated!');
        })
        .catch((err) => {
          const error = err.response ? err.response.data : err;
          alert(`Error updating username: ${error.message}`);
          if (error.errorCode === 'username') {
            this.setState((state) => ({
              username: {
                ...state.username,
                error: error.message
              }
            }));
          }
        });
    } else {
      // update state with input error
      this.setState((state) => ({
        username: {
          ...state.username,
          validateOnChange: true,
          error: usernameError
        }
      }));
    }
  };

  handleSubmitPassword = (event) => {
    event.preventDefault();

    const { password, newPassword } = this.state;
    let newPasswordError = false;

    if (password.value === newPassword.value) {
      newPasswordError = 'New password cannot match current password.';
    } else {
      newPasswordError = validateFields.validatePassword(newPassword.value);
    }

    if (newPasswordError === false) {
      // no input errors, submit the form
      const data = {
        userId: this.props.userId,
        password: password.value,
        newPassword: newPassword.value
      };

      this.props
        .updatePassword(data)
        .then(() => {
          this.setState({
            password: {
              ...initialState.password,
              value: '****'
            },
            newPassword: {
              ...initialState.newPassword
            }
          });
          alert('Password updated!');
        })
        .catch((err) => {
          const error = err.response ? err.response.data : err;
          alert(`Error updating password: ${error.message}`);
          if (error.errorCode === 'password') {
            this.setState((state) => ({
              newPassword: {
                ...state.newPassword,
                error: error.message
              }
            }));
          }
        });
    } else {
      // update state with input error
      this.setState((state) => ({
        newPassword: {
          ...state.newPassword,
          validateOnChange: true,
          error: newPasswordError
        }
      }));
    }
  };

  handleEdit = (id) => {
    let newState = {};

    if (id === 'password') {
      newState['password'] = {
        ...initialState['password'],
        editMode: true
      };
    }
    if (id === 'username') {
      newState['username'] = {
        ...this.state['username'],
        editMode: true
      };
    }

    this.setState(newState);
  };

  handleCancel = (id) => {
    let newState = {};

    if (id === 'username') {
      newState[id] = {
        ...initialState[id],
        value: this.props.username,
        error: ''
      };
    }

    if (id === 'password') {
      newState[id] = {
        ...initialState[id],
        value: '****',
        error: ''
      };

      newState['newPassword'] = {
        ...initialState['newPassword']
      };
    }
    this.setState(newState);
  };

  render() {
    const usernameError = this.state.username.error;
    const newPasswordError = this.state.newPassword.error;

    return (
      <div className="AccountSettings">
        <Form>
          <AccountSettingsItem
            id="username"
            type="text"
            label="Username"
            value={this.state.username.value}
            editMode={this.state.username.editMode}
            error={this.state.username.error}
            onChange={(event) => this.handleChange(validateFields.validateUsername, event)}
            onBlur={(event) => this.handleBlur(validateFields.validateUsername, event)}
            onSubmit={(event) => this.handleSubmitUsername(event)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)}
          />

          {usernameError && (
            <Container>
              <div className="error text-danger">
                <small>{usernameError}</small>
              </div>
            </Container>
          )}

          <AccountSettingsItem
            id="password"
            type="password"
            label={this.state.password.editMode ? 'Confirm Current Password' : 'Password'}
            value={this.state.password.value}
            editMode={this.state.password.editMode}
            onChange={(event) => this.handleChange(null, event)}
            onSubmit={(event) => this.handleSubmitPassword(event)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)}
          />

          {this.state.password.editMode && (
            <AccountSettingsItem
              id="newPassword"
              type="password"
              label="Enter New Password"
              value={this.state.newPassword.value}
              editMode={this.state.password.editMode}
              error={this.state.newPassword.error}
              onChange={(event) => this.handleChange(null, event)}
              onBlur={(event) => this.handleBlur(validateFields.validatePassword, event)}
            />
          )}

          {newPasswordError && (
            <Container>
              <div className="error text-danger">
                <small>{newPasswordError}</small>
              </div>
            </Container>
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    username: state.user.username,
    events: state.user.calendarEvents
  };
};

const mapActionsToProps = {
  updateUsername,
  updatePassword
};

export default connect(mapStateToProps, mapActionsToProps)(AccountSettings);
