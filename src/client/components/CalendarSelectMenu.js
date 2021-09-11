import React from 'react';
import Select from 'react-dropdown-select';

const CalendarSelectMenu = (props) => {
  const calendars = props.calendars.filter(calendar => {
    return calendar && calendar.user && calendar.visibility === true;
  })

  const onChange = (values) => {
    console.log('values', values)
  }

  return (
    <div className='CalendarSelectMenu'>
      <label htmlFor='title' className='text-primary'>Select Calendar (
        <small>
          <a href='/account'>Edit</a>
        </small>
        )
      </label>

      <Select
        options={calendars}
        labelField='name'
        valueField='_id'
        onChange={(values) => onChange(values)}
      />
    </div>
  )
}

export default CalendarSelectMenu;