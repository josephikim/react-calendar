import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import RegisterForm from '../components/RegisterForm';

import icon from '../../../public/calendar-icon.png';
import '../styles/HomePage.css';

class HomePage extends Component {
  constructor(...args) {
    super(...args)
  }

  render() {
    return (
      <div id='home-page'>
        <Container>
          <Row>
            <Col s={{ span: 4, offset: 1 }}>
              <div id='about'>About info goes here</div>
              <img id='calendar-img' src={icon}></img>
            </Col>
            <Col s={{ span: 4, offset: 1 }}>
              <RegisterForm />
              <span>
                Already registered? Please <a href='/login'>login</a>
              </span>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default HomePage;