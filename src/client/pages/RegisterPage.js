import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import RegisterForm from 'client/components/RegisterForm';
import ContentWrapper from 'client/components/ContentWrapper';
import styles from 'client/styles/RegisterPage.module.css';
import mockup from 'client/assets/calendar.png';

const RegisterPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <ContentWrapper>
            <div>
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
            <img className={styles.mockup} src={mockup} alt="Calendar Mockup" onClick={handleShowDialog} />
            {isOpen && (
              <dialog className={styles.dialog} open onClick={handleShowDialog}>
                <img
                  className={styles.mockupFull}
                  src={mockup}
                  onClick={handleShowDialog}
                  alt="React Calendar Mockup"
                />
              </dialog>
            )}
          </ContentWrapper>
        </Col>

        <Col md={4}>
          <ContentWrapper>
            <RegisterForm />
          </ContentWrapper>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
