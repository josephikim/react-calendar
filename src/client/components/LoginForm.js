import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
import { validateFields } from '../validation.js';

import '../styles/LoginForm.css';
class LoginForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      formData: {
        userName: '',
        password: '',
        passwordConfirm: ''
      },
      validateUsernameOnChange: false,
      validatePasswordOnChange: false,
      validatePasswordConfirmOnChange: false,
      usernameError: '',
      passwordError: '',
      passwordConfirmError: '',
      submitCalled: false,
    }
  }

  componentDidMount = () => {
    this.initData()
  }

  initData = () => {
    // load locally stored returning user info
  }
  
  handleBlur = event => {
    const { target: { name, value } } = event;
    switch (name) {
      case 'username':
        this.handleUsernameBlur(value);
        break;
      case 'password':
        this.handlePasswordBlur(value);
        break;
      case 'passwordConfirm':
        this.handlePasswordConfirmBlur(value);
        break;
      default:
        return;
    }
  }

  handleUsernameBlur = (value) => {
    if (
      this.state.validateUsernameOnChange === false &&
      this.state.submitCalled === false
    ) {
      const newState = {
        ...this.state,
        formData: {
          ...this.state.formData,
          username: value
        },
        validateUsernameOnChange: true,
        usernameError: validateFields.validateUsername(value)
      }
      this.setState(newState);
    }
    return;
  }

  handlePasswordBlur = (value) => {
    if (
      this.state.validatePasswordOnChange === false &&
      this.state.submitCalled === false
    ) {
      const newState = {
        ...this.state,
        formData: {
          ...this.state.formData,
          password: value
        },
        validatePasswordOnChange: true,
        passwordError: validateFields.validatePassword(value)
      }
      this.setState(newState);
    }
    return;
  }

  handlePasswordConfirmBlur = (value) => {
    if (
      this.state.validatePasswordConfirmOnChange === false &&
      this.state.submitCalled === false
    ) {
      const newState = {
        ...this.state,
        formData: {
          ...this.state.formData,
          passwordConfirm: value
        },
        validatePasswordConfirmOnChange: true,
        passwordConfirmError: validateFields.validatePasswordConfirm(value, this.state.formData.passsword)
      }
      this.setState(newState);
    }
    return;
  }

  handleChange = (event) => {
    const { target: { name, value } } = event;
    const newState = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [name]: value
      }
    }
    if (name === 'username') {
      newState.usernameError = this.state.validateUsernameOnChange ? validateFields.validateUsername(value) : ''
    }
    if (name === 'password') {
      newState.passwordError = this.state.validatePasswordOnChange ? validateFields.validatePassword(value) : ''
    }
    if (name === 'passwordConfirm') {
      newState.passwordConfirmError = this.state.validatePasswordConfirmOnChange ? validateFields.validatePasswordConfirm(value, this.state.password) : ''
    }
    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // format input data
    // validate input data
    // update component state
  }

  render() {
    return (
      <div id='login-form'>
        <Form>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name='username'
              placeholder='Enter username' 
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              />
          </Form.Group>
          <div className="text-danger">
            <small>{this.state.usernameError}</small>
          </div>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name='password'
              type='password' 
              placeholder='Enter password' 
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              />
          </Form.Group>
          <div className="text-danger">
            <small>{this.state.passwordError}</small>
          </div>

          <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name='passwordConfirm'
              type='password' 
              placeholder='Confirm password' 
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              />
          </Form.Group>
          <div className="text-danger">
            <small>{this.state.passwordConfirmError}</small>
          </div>

          <Button 
            type='submit'
            name='login-form-btn'
            variant='primary'
            onClick={this.handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

export default LoginForm;