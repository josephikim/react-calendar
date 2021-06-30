import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import RegisterForm from '../components/RegisterForm';

class RegisterPage extends Component {
  constructor(...args) {
    super(...args)
  }

  render() {
    return (
      <div id="register-page">
        <Container>
          <Row>
            <Col s={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
              <RegisterForm />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default RegisterPage;