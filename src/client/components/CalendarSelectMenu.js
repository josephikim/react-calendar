import React from 'react';
import Select from 'react-dropdown-select';

const CalendarSelectMenu = (props) => {
  // Disable display of system calendars
  const calendars = props.calendars.map(calendar => {
    if (calendar.systemCalendar === true) {
      calendar.disabled = true;
    }
    return calendar;
  });
  
  const selectedCalendar = calendars.filter(calendar => calendar._id === props.selectedEventCalendarId);

  return (
    <div className='CalendarSelectMenu'>
      <label htmlFor='title' className='text-primary'>Calendar (
        <small>
          <a href='/account'>Edit</a>
        </small>
        )
      </label>

      <Select
        values={selectedCalendar}
        options={calendars}
        labelField='name'
        valueField='_id'
        onChange={(values) => props.onChange(values)}
      />
    </div>
  )
}

export default CalendarSelectMenu;