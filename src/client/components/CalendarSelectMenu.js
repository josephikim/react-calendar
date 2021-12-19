import React from "react";
import Select from "react-dropdown-select";

const CalendarSelectMenu = (props) => {
  // Disable system calendars
  const calendars = props.calendars.map((calendar) => {
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
        options={calendars}
        labelField="name"
        valueField="_id"
        onChange={(values) => props.onChange(values)}
      />
    </div>
  );
};

export default CalendarSelectMenu;
