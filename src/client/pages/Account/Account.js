import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import AccountUserSettings from './AccountUserSettings';
import AccountCalendarSettings from './AccountCalendarSettings';

import './Account.css';
import ContentWrapper from 'client/components/ContentWrapper';

const Account = () => {
  const userId = useSelector((state) => state.auth.userId);
  const username = useSelector((state) => state.user.username);
  const calendars = useSelector((state) => state.user.calendars);

  const isAccountDataLoaded = userId && username && calendars.length > 0;

  if (isAccountDataLoaded) {
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
