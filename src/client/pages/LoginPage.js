import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import LoginForm from '../components/LoginForm';

import '../styles/LoginPage.css';

class LoginPage extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      returningUser: true,
      activeKey: 'register'
    }
  }

  render() {
    return (
      <div id='login-page'>
        <Container>
          <Row>
            <Col s={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
              <LoginForm />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default LoginPage;