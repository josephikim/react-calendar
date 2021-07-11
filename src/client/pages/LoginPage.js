import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import LoginForm from '../components/LoginForm';

import '../styles/LoginPage.css';

class LoginPage extends Component {
  constructor(...args) {
    super(...args)
  }

  render() {
    return (
      <div id='login-page'>
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }} >
              <div className='col-content-wrap'>
                <LoginForm />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default LoginPage;