import React from 'react';
import Select from 'react-dropdown-select';

const CalendarSelectMenu = (props) => {
  // Flag calendars to be disabled in dropdown UI, ie system calendars
  const calendars = props.calendars.map(calendar => {
    if (calendar.user === null) {
      calendar.disabled = true;
    }
    return calendar;
  });

  const defaultCalendar = calendars.filter(calendar => calendar.userDefault === true);

  return (
    <div className='CalendarSelectMenu'>
      <label htmlFor='title' className='text-primary'>Calendar (
        <small>
          <a href='/account'>Edit</a>
        </small>
        )
      </label>

      <Select
        values={defaultCalendar}
        options={calendars}
        labelField='name'
        valueField='_id'
        onChange={(values) => props.onChange(values)}
      />
    </div>
  )
}

export default CalendarSelectMenu;