import React from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import Checkbox from 'client/components/Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import { calendarUpdated, calendarsUpdated } from 'client/store/userSlice';

import './CalendarToggleMenu.css';

const CalendarToggleMenu = () => {
  const dispatch = useDispatch();

  const calendars = useSelector((state) => state.user.calendars);

  const handleVisibilityChange = (event) => {
    const visibility = event.target.checked;
    const id = event.target.id;

    const payload = {
      id,
      visibility
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
              handleChange={(event) => handleVisibilityChange(event)}
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
              {calendar.systemCalendar && (
                <Badge pill variant="light">
                  System
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
