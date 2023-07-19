import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import CalendarToggleMenuItem from './CalendarToggleMenuItem';
import { calendarsUpdated } from 'client/store/userSlice';

import './CalendarToggleMenu.css';

const CalendarToggleMenu = () => {
  const dispatch = useDispatch();

  const calendars = useSelector((state) => state.user.calendars);

  // Set visibility=true for all calendars
  const handleSelectAll = (event) => {
    event.preventDefault();

    const newState = {};

    Object.keys(calendars).forEach((key) => {
      const calendar = {
        ...calendars[key],
        visibility: true
      };

      newState[key] = calendar;
    });

    dispatch(calendarsUpdated(newState));
  };

  // prepare data for render
  const menuItems = Object.values(calendars);

  menuItems
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => b.userDefault - a.userDefault)
    .sort((a, b) => b.systemCalendar - a.systemCalendar);

  return (
    <div className="CalendarToggleMenu">
      <Row>
        <Col>
          <label className="text-primary">My Calendars</label>
        </Col>
      </Row>

      {menuItems.map((item) => (
        <CalendarToggleMenuItem
          id={item.id}
          key={item.id}
          visibility={item.visibility}
          name={item.name}
          color={item.color}
          userDefault={item.userDefault}
          systemCalendar={item.systemCalendar}
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
