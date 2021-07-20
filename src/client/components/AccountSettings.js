import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { validateFields } from '../../validation';

import AccountSettingsItem from './AccountSettingsItem';

import '../styles/AccountSettings.css';


const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  password: {
    value: 'asdf',
    validateOnChange: false,
    error: ''
  },
  passwordConfirm: {
    value: 'asdf',
    validateOnChange: false,
    error: ''
  },
  editMode: false
}
class AccountSettings extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  componentDidMount = () => {
    this.setState(state => ({
      username: {
        ...state.username,
        value: this.props.username
      }
    }))
  }

  handleBlur = (validationFunc, event) => {
    const { target: { name } } = event;

    if (this.state[name]['validateOnChange'] === false) {
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

  handleChange = (event) => {
    const { target: { name, value } } = event;

    this.setState(state => ({
      [name]: {
        ...state[name],
        value: value
      }
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { username, password, passwordConfirm } = this.state;
    const usernameError = validateFields.validateUsername(username.value);
    const passwordError = validateFields.validatePassword(password.value);
    const passwordConfirmError = validateFields.validatePasswordConfirm(passwordConfirm.value, password.value);

    if ([usernameError, passwordError, passwordConfirmError].every(e => e === false)) {
      // no input errors, submit the form
      
    } else {
      // update state with input errors
      this.setState(state => ({
        username: {
          ...state.username,
          validateOnChange: true,
          error: usernameError
        },
        password: {
          ...state.password,
          validateOnChange: true,
          error: passwordError
        },
        passwordConfirm: {
          ...state.passwordConfirm,
          validateOnChange: true,
          error: passwordConfirmError
        }
      }));
    }
  }

  handleEdit = () => {
    this.setState(state => ({
      password: {
        ...state.password,
        value: ''
      },
      passwordConfirm: {
        ...state.passwordConfirm,
        value: ''
      },
      editMode: !this.state.editMode
    }))
  }

  handleCancel = () => {
    this.setState(state => ({
      ...initialState,
      username: {
        ...state.username,
        value: this.props.username
      }
    }))
  }

  render() {
    const readOnly = !this.state.editMode;
    return (
      <div className='AccountSettings'>
        <Form>
          <div className='text-primary'>
            <h4>Account Settings</h4>
          </div>

          <AccountSettingsItem
            id='username'
            type='text'
            label='Username'
            defaultValue={this.state.username.value}
            readOnly={readOnly}
            onChange={event => this.handleChange(event)}
            onBlur={event => this.handleBlur(validateFields.validateUsername, event)}
          />

          <div className='text-danger'>
            <small>{this.state.username.error}</small>
          </div>

          <AccountSettingsItem
            id='password'
            type='password'
            label='Password'
            defaultValue={this.state.password.value}
            readOnly={readOnly}
            onChange={event => this.handleChange(event)}
            onBlur={event => this.handleBlur(validateFields.validatePassword, event)}
          />

          <div className='text-danger'>
            <small>{this.state.password.error}</small>
          </div>

          <AccountSettingsItem
            id='passwordConfirm'
            type='password'
            label='Confirm Password'
            defaultValue={this.state.passwordConfirm.value}
            readOnly={readOnly}
            onChange={event => this.handleChange(event)}
          />

          <div className='text-danger'>
            <small>{this.state.passwordConfirm.error}</small>
          </div>

          {this.state.editMode === false &&
            <Button
              type='button'
              name='editBtn'
              variant='primary'
              onClick={this.handleEdit} >
              Edit
            </Button>
          }

          {this.state.editMode === true &&
            <Button
              type='submit'
              name='saveBtn'
              variant='success'
              onClick={this.handleSubmit} >
              Save
            </Button>
          }

          {this.state.editMode === true &&
            <Button
              type='button'
              name='cancelBtn'
              variant='secondary'
              onClick={this.handleCancel} >
              Cancel
            </Button>
          }
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    userId: state.auth.userId
  };
};

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(AccountSettings);