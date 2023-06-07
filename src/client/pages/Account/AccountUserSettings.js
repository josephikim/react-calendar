import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { validateFields } from 'client/validation';
import { updateUser } from 'client/store/userSlice';

import AccountUserSettingsItem from './AccountUserSettingsItem';

import './AccountUserSettings.css';

class AccountUserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const newState = {
      username: {
        value: this.props.username,
        validateOnChange: false,
        error: null,
        editMode: false
      },
      password: {
        value: '****',
        validateOnChange: false,
        editMode: false,
        error: null
      },
      newPassword: {
        value: undefined,
        validateOnChange: false,
        error: null
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
          error: state[name]['validateOnChange'] ? validationFunc(value) : null
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
        username: username.value
      };

      this.props
        .updateUser(data)
        .then(() => {
          this.setState({
            username: {
              value: data.username,
              validateOnChange: false,
              error: null,
              editMode: false
            }
          });
          alert('Username updated!');
        })
        .catch((e) => {
          const error = e.response ? e.response.data : e;
          const errorCode = error.errorCode ?? null;
          alert(`Error updating username: ${error.message}`);

          // Update state to reflect response errors
          if (errorCode && ['username'].includes(errorCode)) {
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
    let passwordError = false;

    if (password.value === newPassword.value) {
      passwordError = 'New password cannot match current password.';
    } else {
      passwordError = validateFields.validatePassword(newPassword.value);
    }

    if (passwordError === false) {
      // no input errors, submit the form
      const data = {
        password: password.value,
        newPassword: newPassword.value
      };

      this.props
        .updateUser(data)
        .then(() => {
          this.setState({
            password: {
              value: '****',
              validateOnChange: false,
              editMode: false,
              error: null
            },
            newPassword: {
              value: undefined,
              validateOnChange: false,
              error: null
            }
          });
          alert('Password updated!');
        })
        .catch((e) => {
          const error = e.response ? e.response.data : e;
          const errorCode = error.errorCode ?? null;
          alert(`Error updating password: ${error.message}`);

          // Update state to reflect response errors
          if (errorCode && ['password'].includes(errorCode)) {
            this.setState((state) => ({
              password: {
                ...state.password,
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
          error: passwordError
        }
      }));
    }
  };

  handleEdit = (id) => {
    const newState = {};

    if (id === 'password') {
      newState.password = {
        value: '',
        validateOnChange: false,
        editMode: true,
        error: null
      };
    }

    if (id === 'username') {
      newState.username = {
        value: this.state.username.value,
        validateOnChange: false,
        editMode: true,
        error: null
      };
    }

    this.setState(newState);
  };

  handleCancel = (id) => {
    const newState = {};

    if (id === 'username') {
      newState.username = {
        value: this.props.username,
        validateOnChange: false,
        editMode: false,
        error: null
      };
    }

    if (id === 'password') {
      newState.password = {
        value: '****',
        validateOnChange: false,
        editMode: false,
        error: null
      };

      newState.newPassword = {
        value: undefined,
        validateOnChange: false,
        error: null
      };
    }

    this.setState(newState);
  };

  render() {
    const usernameError = this.state.username?.error ?? null;
    const passwordError = this.state.password?.error ?? null;
    const newPasswordError = this.state.newPassword?.error ?? null;
    const passwordEditMode = this.state.password?.editMode ?? false;

    return (
      <div className="AccountUserSettings">
        <Form>
          <AccountUserSettingsItem
            id="username"
            type="text"
            label="Username"
            value={this.state.username?.value ?? this.props.username}
            error={usernameError}
            editMode={this.state.username?.editMode ?? false}
            onChange={(event) => this.handleChange(validateFields.validateUsername, event)}
            onBlur={(event) => this.handleBlur(validateFields.validateUsername, event)}
            onSubmit={(event) => this.handleSubmitUsername(event)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)}
          />

          <AccountUserSettingsItem
            id="password"
            type="password"
            label={passwordEditMode ? 'Confirm Current Password' : 'Password'}
            value={this.state.password?.value ?? '****'}
            error={passwordError}
            editMode={passwordEditMode}
            onChange={(event) => this.handleChange(validateFields.validatePassword, event)}
            onSubmit={(event) => this.handleSubmitPassword(event)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)}
          />

          {passwordEditMode && (
            <AccountUserSettingsItem
              id="newPassword"
              type="password"
              label="Enter New Password"
              value={this.state.newPassword?.value ?? ''}
              error={newPasswordError}
              editMode="true"
              onChange={(event) => this.handleChange(validateFields.validatePassword, event)}
              onBlur={(event) => this.handleBlur(validateFields.validatePassword, event)}
            />
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username
  };
};

const mapActionsToProps = {
  updateUser
};

export default connect(mapStateToProps, mapActionsToProps)(AccountUserSettings);
