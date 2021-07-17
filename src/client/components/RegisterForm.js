import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { validateFields } from '../../validation.js';
import { registerUser } from '../actions/authActions';

import '../styles/RegisterForm.css';

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
  }
}
class RegisterForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
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

  handleChange = (validationFunc, event) => {
    const { target: { name, value } } = event;

    if (validationFunc === null) { // handle fields without validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value
        }
      }));
    } else {  // handle fields with validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value,
          error: state[name]['validateOnChange'] ? validationFunc(value) : ''
        }
      }));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { username, password, passwordConfirm } = this.state;
    const usernameError = validateFields.validateUsername(username.value);
    const passwordError = validateFields.validatePassword(password.value);
    const passwordConfirmError = validateFields.validatePasswordConfirm(passwordConfirm.value, password.value);

    if ([usernameError, passwordError, passwordConfirmError].every(e => e === false)) {
      // no input errors, submit the form
      const data = {
        username: username.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value
      }

      this.props.registerUser(data)
        .then(() => {
          this.setState(initialState)
        })
        .catch(err => {
          const errorsObj = err.errors ? err.errors : err.error;
          for (const property in errorsObj) {
            this.setState(state => ({
              [property]: {
                ...state[property],
                error: errorsObj[property]
              }
            }));
          }
        });
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

  render() {
    return (
      <div className='RegisterForm'>
        <Form>
          <div className='text-primary'>
            <h4>New User Registration</h4>
          </div>

          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name='username'
              placeholder='Enter username'
              onChange={event => this.handleChange(validateFields.validateUsername, event)}
              onBlur={event => this.handleBlur(validateFields.validateUsername, event)}
            />
          </Form.Group>

          <div className='text-danger'>
            <small>{this.state.username.error}</small>
          </div>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              placeholder='Enter password'
              onChange={event => this.handleChange(validateFields.validatePassword, event)}
              onBlur={event => this.handleBlur(validateFields.validatePassword, event)}
            />
          </Form.Group>

          <div className='text-danger'>
            <small>{this.state.password.error}</small>
          </div>

          <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              name='passwordConfirm'
              placeholder='Confirm password'
              onChange={event => this.handleChange(null, event)}
            />
          </Form.Group>

          <div className='text-danger'>
            <small>{this.state.passwordConfirm.error}</small>
          </div>

          <Button
            type='submit'
            name='register-form-btn'
            variant='primary'
            onClick={this.handleSubmit}>
            Register
          </Button>
        </Form>
        
        <span>
          Already registered? Please <a href='/login'>login</a>.
        </span>
      </div>
    )
  }
}

const mapActionsToProps = {
  registerUser
}

export default connect(null, mapActionsToProps)(RegisterForm);