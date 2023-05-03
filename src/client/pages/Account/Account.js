import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import AccountUserSettings from './AccountUserSettings';
import AccountCalendarSettings from './AccountCalendarSettings';

import './Account.css';
import ContentWrapper from 'client/components/ContentWrapper';

const Account = () => {
  const calendars = useSelector((state) => state.user.calendars);

  if (calendars.length > 0) {
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
  } else {
    return <div>Loading page...</div>;
  }
};

export default Account;
