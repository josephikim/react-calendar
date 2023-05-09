import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import Checkbox from 'client/components/Checkbox';
import { useDispatch } from 'react-redux';

import './CalendarToggleMenu.css';

const CalendarToggleMenuItem = ({ id, visibility, name, color, userDefault, systemCalendar }) => {
  const dispatch = useDispatch();

  const handleVisibilityChange = (event) => {
    event.preventDefault();
    const visibility = event.target.checked;
    const id = event.target.id;

    const payload = {
      id,
      visibility
    };
    dispatch(calendarUpdated(payload));
  };

  return (
    <Row id="calendar-toggle">
      <Col xs={2}>
        <Checkbox id={`${id}`} checked={visibility} handleChange={(e) => handleVisibilityChange(e)} />
      </Col>

      <Col xs={10}>
        <label htmlFor={`${id}`} style={{ backgroundColor: color }}>
          {name}
          {userDefault && (
            <Badge pill variant="light">
              Default
            </Badge>
          )}
          {systemCalendar && (
            <Badge pill variant="light">
              System
            </Badge>
          )}
        </label>
      </Col>
    </Row>
  );
};

export default CalendarToggleMenuItem;
