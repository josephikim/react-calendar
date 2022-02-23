import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Checkbox from './Checkbox';
// import { connect, useDispatch } from 'react-redux';
// import { calendarVisibilityUpdated } from '../store/userSlice';

const CalendarToggleMenu = () => {
  // const dispatch = useDispatch();

  const calendars = useSelector((state) => state.user.calendars);

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    const calendarId = event.target.id;
    debugger;

    // dispatch(calendarVisibilityUpdated(calendarId));
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
              id={`${calendar._id}`}
              checked={calendar.visibility}
              handleChange={(event) => handleChange(event)}
            />
          </Col>
          <Col xs={12} md={10}>
            <label htmlFor={`${calendar._id}`} className="text-primary">
              {calendar.name}
            </label>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default CalendarToggleMenu;
// export default connect(null, null)(CalendarToggleMenu);
