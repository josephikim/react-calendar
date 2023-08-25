import React from 'react';
import { Row, Col } from 'react-bootstrap';
import UserSettings from 'client/components/UserSettings';
import CalendarSettings from 'client/components/CalendarSettings';
import ContentWrapper from 'client/components/ContentWrapper';

const AccountPage = () => {
  return (
    <div>
      <Row className="justify-content-center">
        <Col md={8}>
          <ContentWrapper>
            <div className="heading text-primary text-center mt-4 mb-5">
              <h4>Account Settings</h4>
            </div>
            <UserSettings />
            <div className="heading text-primary text-center mt-4  mb-5">
              <h4>Calendar Settings</h4>
            </div>
            <CalendarSettings />
          </ContentWrapper>
        </Col>
      </Row>
    </div>
  );
};

export default AccountPage;
