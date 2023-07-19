import React from 'react';
import { Select } from 'react-dropdown-select';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CalendarSelectMenu = (props) => {
  const calendars = useSelector((state) => state.user.calendars);

  // returns array of objects
  const options = Object.values(calendars).map((v) => {
    // Disable system calendars
    const option = {
      value: v.id,
      label: v.name,
      disabled: v.systemCalendar
    };

    return option;
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
