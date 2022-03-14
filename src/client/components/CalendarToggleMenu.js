import React from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import Checkbox from './Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import { calendarUpdated, calendarsUpdated } from '../store/userSlice';

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

  const handleSelectAll = () => {
    const mappedObjectsArray = calendars.map((calendar) => {
      return {
        ...calendar,
        visibility: true
      };
    });

    dispatch(calendarsUpdated(mappedObjectsArray));
  };

  return (
    <div className="CalendarToggleMenu">
      <Row>
        <Col>
          <label className="text-primary">My Calendars</label>
        </Col>
      </Row>

      {calendars.map((calendar) => (
        <Row id="calendar-toggle" key={calendar.id}>
          <Col xs={2}>
            <Checkbox
              id={`${calendar.id}`}
              checked={calendar.visibility}
              handleChange={(event) => handleChange(event)}
            />
          </Col>

          <Col xs={10}>
            <label htmlFor={`${calendar.id}`} style={{ backgroundColor: calendar.color }}>
              {calendar.name}
              {calendar.userDefault && (
                <Badge pill variant="light">
                  Default
                </Badge>
              )}
            </label>
          </Col>
        </Row>
      ))}

      <Row>
        <Col>
          <Button type="button" id="select-all-btn" variant="primary" onClick={() => handleSelectAll()}>
            Select All
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CalendarToggleMenu;
