import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import CalendarToggleMenuItem from './CalendarToggleMenuItem';
import { updateCalendar } from 'client/store/calendarsSlice';

import './CalendarToggleMenu.css';

const CalendarToggleMenu = () => {
  const dispatch = useDispatch();

  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);

  // Set visibility=true for all calendars
  const handleSelectAll = (event) => {
    event.preventDefault();

    const newState = {};

    calendarIds.forEach((id) => {
      const calendarState = {
        ...calendars[id],
        visibility: true
      };

      newState[id] = calendarState;
    });

    dispatch(updateCalendar(newState)).catch((e) => {
      const error = e.response?.data ?? e;
      alert(`Error updating visibility: ${error.message ?? error.statusText}`);
    });
  };

  // prepare data for render
  const orderedCalendarIds = [...calendarIds]
    .sort((a, b) => calendars[b].userDefault - calendars[a].userDefault)
    .sort((a, b) => (calendars[b].user_id === 'system') - (calendars[a].user_id === 'system'));

  return (
    <div className="CalendarToggleMenu">
      <Row>
        <Col>
          <label className="text-primary">My Calendars</label>
        </Col>
      </Row>

      {orderedCalendarIds.map((id) => (
        <CalendarToggleMenuItem
          id={id}
          key={id}
          visibility={calendars[id].visibility}
          name={calendars[id].name}
          color={calendars[id].color}
          userDefault={calendars[id].userDefault}
          isSystemCalendar={calendars[id].user_id === 'system'}
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
