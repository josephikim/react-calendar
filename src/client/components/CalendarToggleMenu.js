import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Checkbox from './Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import { calendarUpdated, allCalendarsUpdated } from '../store/userSlice';

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
      <Row>
        <label className="text-primary">My Calendars</label>
      </Row>

      {calendars.map((calendar) => (
        <Row key={calendar.id}>
          <Col xs={12} md={2}>
            <Checkbox
              id={`${calendar.id}`}
              checked={calendar.visibility}
              handleChange={(event) => handleChange(event)}
            />
          </Col>
          <Col xs={12} md={10}>
            <label htmlFor={`${calendar.id}`} className="text-primary">
              {calendar.name}
            </label>
          </Col>
        </Row>
      ))}

      <Row>
        <Button type="button" id="select-all-btn" className="btn" variant="primary" onClick={(e) => handleSubmit(e)}>
          Select All
        </Button>
      </Row>
    </div>
  );
};

export default CalendarToggleMenu;
