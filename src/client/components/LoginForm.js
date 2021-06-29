import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
import { validateFields } from '../validation.js';

import '../styles/LoginForm.css';

const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  password: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  passwordConfirm: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  submitCalled: false,
}
class LoginForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  componentDidMount = () => {
    this.initData()
  }

  initData = () => {
    // load locally stored returning user info
  }
  
  handleBlur = (validationFunc, event) => {
    const { target: { name } } = event;

    if (
      this.state[name]['validateOnChange'] === false &&
      this.state.submitCalled === false
    ) {
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

  handlePasswordConfirmBlur = (validationFunc) => {
    if (
      this.state.passwordConfirm.validateOnChange === false &&
      this.state.submitCalled === false
    ) {
      this.setState(state => ({
        passwordConfirm: {
          ...state.passwordConfirm,
          validateOnChange: true,
          error: validationFunc(state.passwordConfirm.value, state.password.value)
        }
      }));
    }
    return;
  }

  handleChange = (validationFunc, event) => {
    const { target: { name, value } } = event;
    
    this.setState(state => ({
      [name]: {
        ...state[name],
        value: value,
        error: state[name]['validateOnChange'] ? validationFunc(value) : ''
      }
    }));
  }

  handlePasswordConfirmChange = (validationFunc, event) => {
    const value = event.target.value;
    
    this.setState(state => ({
      passwordConfirm: {
        ...state.passwordConfirm,
        value: value,
        error: state.passwordConfirm.validateOnChange ? validationFunc(value, state.password.value) : ''
      }
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // const data = {
    //   username: this.state.username.value,
    //   password: this.state.password.value,
    //   passwordConfirm: this.state.passwordConfirm.value
    // }
    // console.log('!!data.username.trim()', !!data.username.trim())
    // console.log('!!data.password.trim()', !!data.password.trim())
    // console.log('!!data.passwordConfirm.trim()', !!data.passwordConfirm.trim())
    // const validInput = !!data.username.trim() && 
    //   !!data.password.trim() && 
    //   !!data.passwordConfirm.trim() &&
    //   !this.state.usernameError &&
    //   !this.state.passwordError &&
    //   !this.state.passwordConfirmError

    // if (validInput) {

    // }
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
              onChange={event => this.handleChange(validateFields.validateUsername, event)}
              onBlur={event => this.handleBlur(validateFields.validateUsername, event)}
              />
          </Form.Group>
          
          <div className="text-danger">
            <small>{this.state.username.error}</small>
          </div>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name='password'
              type='password' 
              placeholder='Enter password' 
              onChange={event => this.handleChange(validateFields.validatePassword, event)}
              onBlur={event => this.handleBlur(validateFields.validatePassword, event)}
              />
          </Form.Group>

          <div className="text-danger">
            <small>{this.state.password.error}</small>
          </div>

          <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              name='passwordConfirm'
              type='password' 
              placeholder='Confirm password' 
              onChange={event => this.handlePasswordConfirmChange(validateFields.validatePasswordConfirm, event)}
              onBlur={this.handlePasswordConfirmBlur(validateFields.validatePasswordConfirm)}
              />
          </Form.Group>

          <div className="text-danger">
            <small>{this.state.passwordConfirm.error}</small>
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