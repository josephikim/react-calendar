import React from 'react';
import { Form } from 'react-bootstrap';

// import '../styles/CalendarSettingsItem.css';

const CalendarSettingsItem = () => {
  return (
    <div className='CalendarSettingsItem'>
      <Form.Group controlId='calendarId'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          name='calendarName'
          placeholder='calendarName'
        />
      </Form.Group>

      {/* <div className='text-danger'>
        <small>{this.state.username.error}</small>
      </div> */}
    </div >
  )
};

export default CalendarSettingsItem;