import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import AccountSettings from '../components/AccountSettings';
import CalendarSettings from '../components/CalendarSettings';

import '../styles/AccountPage.css';

const AccountPage = () => {
  const userId = useSelector((state) => state.auth.userId);
  const username = useSelector((state) => state.user.username);
  const calendars = useSelector((state) => state.user.calendars);

  const isAccountDataLoaded = userId && username && calendars.length > 0;

  if (isAccountDataLoaded) {
    return (
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
  } else {
    return <div>Loading page...</div>;
  }
};

export default AccountPage;
