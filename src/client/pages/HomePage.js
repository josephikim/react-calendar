import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import RegisterForm from '../components/RegisterForm';

import icon from '../../../public/calendar-icon.png';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className='HomePage'>
      <Container>
        <Row>

          <Col md={6}>
            <div id='about'>
              <p><strong>React Calendar</strong> is an easy-to-use online calendar app powered by <a href='https://reactjs.org/' target='_blank'>React</a>.</p>
              <p>Register your username to get started!</p>
              <img id='calendar-img' src={icon}></img>
            </div>
          </Col>

          <Col md={6}>
            <RegisterForm />
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default HomePage;