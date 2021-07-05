import React, { Component } from 'react'
import { Col, Container, Row, Tabs, Tab, Alert } from 'react-bootstrap'
import { connect } from 'react-redux';

import RegisterForm from '../components/RegisterForm';
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

  setKey = (key) => {
    this.setState({
      activeKey: key
    });
  }

  render() {
    const registerTabSelected = this.state.activeKey === 'register';
    const loginTabSelected = this.state.activeKey === 'login';
    return (
      <div id='login-page'>
        <Container>
          <Row>
            <Col s={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
              <div id='tabs-wrapper'>
                <Tabs
                  id='tabs'
                  activeKey={this.state.activeKey}
                  onSelect={(k) => this.setKey(k)}
                >
                  <Tab eventKey='register' title='New User'>
                    {registerTabSelected && <RegisterForm />}
                  </Tab>
                  <Tab eventKey='login' title='Returning User'>
                    {loginTabSelected && <LoginForm />}
                  </Tab>
                </Tabs>
              </div>
              <Alert variant='primary'>
                Please register in order to access private calendars!
              </Alert>
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