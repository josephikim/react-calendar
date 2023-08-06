import React from 'react';
import { Select } from 'react-dropdown-select';
import { Link } from 'react-router-dom';

const CalendarSelectMenu = ({ disabled, values, options, onChange }) => {
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
        disabled={disabled}
        values={values}
        options={options}
        labelField="name"
        valueField="id"
        onChange={(values) => onChange(values)}
      />
    </div>
  );
};

export default CalendarSelectMenu;
