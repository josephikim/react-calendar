import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { updateCalendarSettings } from 'client/store/calendarsSlice';
import CalendarToggleMenuItem from './CalendarToggleMenuItem';
import './CalendarToggleMenu.css';

const CalendarToggleMenu = ({ calendars, calendarIds }) => {
  const dispatch = useDispatch();

  // order calendars for render:
  // 1. system cals
  // 2. user default cal
  // 3. remaining user cals
  const orderedCalendarIds = Object.keys(calendars)
    .sort((a, b) => calendars[b].userDefault - calendars[a].userDefault)
    .sort((a, b) => (calendars[b].user_id === 'system') - (calendars[a].user_id === 'system'));

  return (
    <div className="CalendarToggleMenu">
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
