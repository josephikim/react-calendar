import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import AccountSettings from '../components/AccountSettings';
import CalendarSettings from '../components/CalendarSettings';

import '../styles/AccountPage.css';

const AccountPage = () => {
  return (
    <div className='AccountPage'>
      <Container>
        <Row>
          <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
            <AccountSettings />
          </Col>
        </Row>

        <Row>
          <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
            <CalendarSettings />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AccountPage;