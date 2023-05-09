import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import CalendarToggleMenuItem from './CalendarToggleMenuItem';
import { calendarsUpdated } from 'client/store/userSlice';

import './CalendarToggleMenu.css';

const CalendarToggleMenu = () => {
  const dispatch = useDispatch();

  const calendars = useSelector((state) => state.user.calendars);

  const handleSelectAll = (event) => {
    event.preventDefault();
    const newState = calendars.map((calendar) => {
      return {
        ...calendar,
        visibility: true
      };
    });

    dispatch(calendarsUpdated(newState));
  };

  return (
    <div className="CalendarToggleMenu">
      <Row>
        <Col>
          <label className="text-primary">My Calendars</label>
        </Col>
      </Row>

      {calendars.map((calendar) => (
        <CalendarToggleMenuItem
          id={calendar.id}
          key={calendar.id}
          visibility={calendar.visibility}
          name={calendar.name}
          color={calendar.color}
          userDefault={calendar.userDefault}
          systemCalendar={calendar.systemCalendar}
        />
      ))}

      <Row>
        <Col>
          <Button type="button" id="select-all-btn" variant="primary" onClick={(e) => handleSelectAll(e)}>
            Select All
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CalendarToggleMenu;
