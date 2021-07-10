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
            
            <Col md={6}>
              <div className='col-content-wrap'>
                <div id='about'>
                  <p><strong>React Calendar</strong> is an easy-to-use online calendar app powered by Node.js and React.</p>
                  <p>Register your username to get started!</p>
                </div>
                <img id='calendar-img' src={icon}></img>
              </div>
            </Col>

            <Col md={6}>
              <div className='col-content-wrap'>
                <RegisterForm />
                <span>
                  Already registered? Please <a href='/login'>login</a>.
                </span>
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    )
  }
}

export default HomePage;