import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Badge } from 'react-bootstrap';
import { updateCalendarSettings } from 'client/store/calendarsSlice';
import Checkbox from './Checkbox';
import styles from 'client/styles/CalendarToggleMenuItem.module.css';

const CalendarToggleMenuItem = ({ id, calendar }) => {
  const dispatch = useDispatch();

  const handleVisibilityChange = (event) => {
    const checked = event.target.checked;
    const id = event.target.id;

    const data = {
      id,
      visibility: checked
    };

    dispatch(updateCalendarSettings(data)).catch((e) => {
      const error = e.response?.data ?? e;
      alert(`Error updating visibility: ${error.message ?? error.statusText}`);
    });
  };

  return (
    <Row className={styles.container}>
      <Col xs={2}>
        <Checkbox id={id} checked={calendar.visibility} handleChange={handleVisibilityChange} />
      </Col>

      <Col xs={10}>
        <label className={styles.label} htmlFor={id} style={{ backgroundColor: calendar.color }}>
          {calendar.name}
          {calendar.userDefault === true && (
            <Badge className={styles.badge} pill variant="light">
              Default
            </Badge>
          )}
          {calendar.user_id === 'system' && (
            <Badge className={styles.badge} pill variant="light">
              System
            </Badge>
          )}
        </label>
      </Col>
    </Row>
  );
};

export default CalendarToggleMenuItem;
