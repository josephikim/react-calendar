import React from 'react';
import { Select } from 'react-dropdown-select';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CalendarSelectMenu = (props) => {
  const calendars = useSelector((state) => state.user.calendars);

  const options = calendars.map((calendar) => {
    // Disable system calendars
    const result = {
      ...calendar,
      disabled: calendar.systemCalendar === true
    };

    return result;
  });

  return (
    <div className="CalendarSelectMenu">
      <label htmlFor="title" className="text-primary">
        Calendar (
        <small>
          <Link to="/account">Edit</Link>
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
