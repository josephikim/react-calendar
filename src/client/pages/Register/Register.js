import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import ContentWrapper from '../../components/ContentWrapper';
import RegisterForm from './RegisterForm';
import mockup from '../../assets/calendar.png';

import './Register.css';

const Register = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="Register">
      <Container>
        <Row>
          <Col md={6}>
            <ContentWrapper>
              <div className="register-about">
                <p>
                  <strong>React Calendar</strong> is a simple-to-use online calendar built with{' '}
                  <a href="https://jquense.github.io/react-big-calendar/" target="_blank" rel="noreferrer">
                    React Big Calendar
                  </a>
                  . It supports multiple views, custom calendars and data localization.
                </p>
                <p>Register your username to get started!</p>
              </div>
            </ContentWrapper>
            <ContentWrapper>
              <img className="register-img" src={mockup} alt="Calendar Mockup" onClick={handleShowDialog} />
              {isOpen && (
                <dialog className="dialog" open onClick={handleShowDialog}>
                  <img
                    className="register-img-mockup"
                    src={mockup}
                    onClick={handleShowDialog}
                    alt="React Calendar Mockup"
                  />
                </dialog>
              )}
            </ContentWrapper>
          </Col>

          <Col md={6}>
            <ContentWrapper>
              <RegisterForm />
            </ContentWrapper>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
