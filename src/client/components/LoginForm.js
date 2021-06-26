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
      validateUsernameOnChange: true,
      validatePasswordOnChange: true,
      validatePasswordConfirmOnChange: true,
      usernameError: '',
      passwordError: '',
      passwordConfirmError: ''
    }
  }

  componentDidMount = () => {
    this.initData()
  }

  initData = () => {
    // load locally stored returning user info
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
              />
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name='password'
              type='password' 
              placeholder='Enter password' 
              onChange={this.handleChange}
              />
          </Form.Group>

          <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name='passwordConfirm'
              type='password' 
              placeholder='Confirm password' 
              onChange={this.handleChange}
              />
          </Form.Group>

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