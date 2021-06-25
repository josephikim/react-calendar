import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
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
      <div id="login-form">
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We&apos;ll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Form.Group controlId="formPasswordConfirm">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

export default LoginForm;