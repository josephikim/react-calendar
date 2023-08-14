import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CalendarToggleMenuItem from './CalendarToggleMenuItem';
import styles from 'client/styles/CalendarToggleMenu.module.css';

const CalendarToggleMenu = ({ calendars, calendarIds }) => {
  // sort calendars for render:
  // 1. system cals
  // 2. user default cal
  // 3. remaining user cals
  const orderedCalendarIds = Object.keys(calendars)
    .sort((a, b) => calendars[b].userDefault - calendars[a].userDefault)
    .sort((a, b) => (calendars[b].user_id === 'system') - (calendars[a].user_id === 'system'));

  return (
    <div className={styles.container}>
      <Row>
        <Col>
          <label className="text-primary">My Calendars</label>
        </Col>
      </Row>

      {orderedCalendarIds.map((calendarId) => (
        <CalendarToggleMenuItem id={calendarId} key={calendarId} calendar={calendars[calendarId]} />
      ))}
    </div>
  );
};

export default CalendarToggleMenu;
