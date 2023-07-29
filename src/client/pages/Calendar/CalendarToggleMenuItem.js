import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import Checkbox from 'client/components/Checkbox';
import { useDispatch } from 'react-redux';
import { calendarUpdated, updateCalendar } from 'client/store/calendarsSlice';

import './CalendarToggleMenu.css';

const CalendarToggleMenuItem = ({ id, visibility, name, color, userDefault, isSystemCalendar }) => {
  const dispatch = useDispatch();

  const handleVisibilityChange = async (event) => {
    const checked = event.target.checked;
    const id = event.target.id;

    const payload = {
      id,
      visibility: checked
    };

    // try {
    //   if (isSystemCalendar) {
    //     dispatch(calendarUpdated(payload));
    //   } else {
    //     dispatch(updateCalendar(payload));
    //   }
    // } catch (e) {
    //   const error = e.response?.data ?? e;
    //   alert(`Error updating event: ${error}`);
    // }

    dispatch(updateCalendar(payload)).catch((e) => {
      const error = e.response?.data ?? e;
      alert(`Error updating visibility: ${error}`);
    });
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
          {isSystemCalendar && (
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
