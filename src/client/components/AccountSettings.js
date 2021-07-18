import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

const initialState = {
  username: {
    value: 'myusername',
    validateOnChange: false,
    error: ''
  },
  password: {
    value: 'mypassword',
    validateOnChange: false,
    error: ''
  },
  passwordConfirm: {
    value: '',
    validateOnChange: false,
    error: ''
  }
}
class AccountSettings extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  render() {
    return (
      <div className='AccountSettings'>
        <Form>
          <div className='text-primary'>
            <h4>Account Settings</h4>
          </div>

          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name='username'
              placeholder={this.state.username.value}
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
              placeholder={this.state.password.value}
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
              placeholder={this.state.passwordConfirm.value}
            />
          </Form.Group>

          <div className='text-danger'>
            <small>{this.state.passwordConfirm.error}</small>
          </div>

          <Button
            type='submit'
            name='register-form-btn'
            variant='primary'>
            Submit
          </Button>
        </Form>      
      </div>
    )
  }
}

const mapActionsToProps = {
}

export default connect(null, mapActionsToProps)(AccountSettings);