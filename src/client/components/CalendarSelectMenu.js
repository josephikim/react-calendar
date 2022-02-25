import React from 'react';
import Select from 'react-dropdown-select';

const CalendarSelectMenu = (props) => {
  // Disable system calendars
  const calendars = JSON.parse(JSON.stringify(props.calendars));
  const calendarOptions = calendars.map((calendar) => {
    if (calendar.systemCalendar === true) {
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
        options={calendarOptions}
        labelField="name"
        valueField="id"
        onChange={(values) => props.onChange(values)}
      />
    </div>
  );
};

export default CalendarSelectMenu;
