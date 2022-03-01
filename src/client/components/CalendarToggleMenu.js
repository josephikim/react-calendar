import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Checkbox from './Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import { calendarUpdated, allCalendarsUpdated } from '../store/userSlice';

import '../styles/CalendarToggleMenu.css';

const CalendarToggleMenu = () => {
  const dispatch = useDispatch();

  const calendars = useSelector((state) => state.user.calendars);

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    const calendarId = event.target.id;

    const payload = {
      id: calendarId,
      visibility: isChecked
    };
    dispatch(calendarUpdated(payload));
  };

  const handleSubmit = (event) => {
    const mappedObjectsArray = calendars.map((calendar) => {
      return {
        ...calendar,
        visibility: true
      };
    });

    dispatch(allCalendarsUpdated(mappedObjectsArray));
  };

  return (
    <div className="CalendarToggleMenu">
      <label className="text-primary">My Calendars</label>

      {calendars.map((calendar) => (
        <Row id="calendar-toggle-entry" key={calendar.id}>
          <Col>
            <Checkbox
              id={`${calendar.id}`}
              checked={calendar.visibility}
              handleChange={(event) => handleChange(event)}
            />
            <label htmlFor={`${calendar.id}`} style={{ backgroundColor: calendar.color }}>
              {calendar.name}
            </label>
          </Col>
        </Row>
      ))}

      <Button type="button" id="select-all-btn" variant="link" onClick={(e) => handleSubmit(e)}>
        Select All
      </Button>
    </div>
  );
};

export default CalendarToggleMenu;
