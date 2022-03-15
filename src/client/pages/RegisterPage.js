import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import RegisterForm from '../components/RegisterForm';

import icon from '../../../public/calendar-icon.png';
import '../styles/RegisterPage.css';

const RegisterPage = () => (
  <div className="RegisterPage">
    <Container>
      <Row>
        <Col md={6}>
          <div id="about">
            <p>
              <strong>React Calendar</strong> is an easy-to-use online calendar app powered by{' '}
              <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
                React
              </a>
            </p>
            <p>Register your username to get started!</p>
            <img src={icon}></img>
          </div>
        </Col>

        <Col md={6}>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  </div>
);

export default RegisterPage;
