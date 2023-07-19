import React from 'react';
import { Container } from 'react-bootstrap';
import AccountUserSettings from './AccountUserSettings';
import AccountCalendarSettings from './AccountCalendarSettings';
import ContentWrapper from 'client/components/ContentWrapper';
import './Account.css';

const Account = () => {
  return (
    <div className="Account">
      <Container>
        <ContentWrapper>
          <div className="heading text-primary">
            <h4>Account Settings</h4>
          </div>
          <AccountUserSettings />
        </ContentWrapper>

        <ContentWrapper>
          <div className="heading text-primary">
            <h4>Calendar Settings</h4>
          </div>
          <AccountCalendarSettings />
        </ContentWrapper>
      </Container>
    </div>
  );
};

export default Account;
