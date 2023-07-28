import React from 'react';
import { Select } from 'react-dropdown-select';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CalendarSelectMenu = (props) => {
  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);

  // returns array of objects
  const options = calendarIds.map((id) => {
    // Disable system calendars
    const option = {
      id,
      name: calendars[id].name,
      disabled: calendars[id].user_id === 'system'
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
        searchable={false}
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
