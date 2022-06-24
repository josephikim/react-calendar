import React from 'react';
import Select from 'react-dropdown-select';
import { useSelector } from 'react-redux';

const CalendarSelectMenu = (props) => {
  const calendars = useSelector((state) => state.user.calendars);
  const clonedCalendars = JSON.parse(JSON.stringify(calendars));

  const options = clonedCalendars.map((calendar) => {
    // Disable system calendars
    if (calendar.systemCalendar) {
      calendar.disabled = true;
    }

    return calendar;
  });

  return (
    <div className="CalendarSelectMenu">
      <label htmlFor="title" className="text-primary">
        Calendar (
        <small>
          <a href="/account">Edit</a>
        </small>
        )
      </label>

      <Select
        placeholder="Select calendar..."
        disabled={props.disabled}
        values={props.selected}
        options={options}
        labelField="name"
        valueField="id"
        onChange={(values) => props.onChange(values)}
      />
    </div>
  );
};

export default CalendarSelectMenu;
