import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import AccountSettings from '../components/AccountSettings';
import CalendarSettings from '../components/CalendarSettings';

import '../styles/AccountPage.css';

const AccountPage = () => (
  <div className="AccountPage">
    <Container>
      <Row>
        <Col>
          <div className="heading text-primary">
            <h4>Account Settings</h4>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <AccountSettings />
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="heading text-primary">
            <h4>Calendar Settings</h4>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <CalendarSettings />
        </Col>
      </Row>
    </Container>
  </div>
);

export default AccountPage;
