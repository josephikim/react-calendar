import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux';

import LoginForm from '../components/LoginForm';

class LoginPage extends Component {
  constructor(...args) {
    super(...args)
  }

  render() {
    return (
      <div id="login-page">
        <Container>
          <Row className="align-items-center">
            <Col>
              <LoginForm />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    calendars: state.calendars
  };
};

export default connect(mapStateToProps)(LoginPage);