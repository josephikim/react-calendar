import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import CalendarToggleMenuItem from './CalendarToggleMenuItem';
import { calendarsUpdated } from 'client/store/calendarsSlice';

import './CalendarToggleMenu.css';

const CalendarToggleMenu = () => {
  const dispatch = useDispatch();

  const calendars = useSelector((state) => state.calendars.all);

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
  const menuItems = Object.entries(calendars);

  menuItems
    .sort((a, b) => b[1].userDefault - a[1].userDefault)
    .sort((a, b) => b[1].systemCalendar - a[1].systemCalendar);

  return (
    <div className="CalendarToggleMenu">
      <Row>
        <Col>
          <label className="text-primary">My Calendars</label>
        </Col>
      </Row>

      {menuItems.map((item) => (
        <CalendarToggleMenuItem
          id={item[0]}
          key={item[0]}
          visibility={item[1].visibility}
          name={item[1].name}
          color={item[1].color}
          userDefault={item[1].userDefault}
          systemCalendar={item[1].systemCalendar}
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
