import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';

import CalendarSettingsItem from './CalendarSettingsItem';

const initialState = {
  calendars: [
    {
      id: 0,
      name: 'default',
      validateOnChange: false,
      error: ''
    }
  ]
}
class CalendarSettings extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  addCalendar = () => {
    this.setState(this.state.calendars.push(
      {
        id: this.state.calendars.length,
        name: "mycalendar",
        validateOnChange: false,
        error: ''
      }
    ))
  }

  render() {
    return (
      <div className='CalendarSettings'>
        <Form>
          <div className='text-primary'>
            <h4>Calendar Settings</h4>
          </div>
          {
            this.state.calendars.map((item) => (
              <CalendarSettingsItem key={item.id} name={item.name} />
            ))
          }
        </Form>
      </div>
    )
  }
}

const mapActionsToProps = {
}

export default connect(null, mapActionsToProps)(CalendarSettings);