import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

import '../styles/LoginForm.css';
class LoginForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      events: []
    }
  }

  componentDidMount = () => {
    this.initData()
  }

  initData = () => {
    // load locally stored returning user info
  }

  render() {
    return (
      <div id='login-form'>
        <Form>
          <Form.Group controlId='formUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder='Enter username' />
          </Form.Group>

          <Form.Group controlId='formPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Enter password' />
          </Form.Group>

          <Form.Group controlId='formPasswordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' placeholder='Confirm password' />
          </Form.Group>

          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

export default LoginForm;