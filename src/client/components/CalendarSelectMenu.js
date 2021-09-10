import React, { useState } from 'react';
import MultiSelect from 'react-multi-select-component';

import '../libs/react-bootstrap-multiselect/bootstrap-multiselect.css';

const CalendarSelectMenu = (props) => {
  const multiSelectData = props.calendars.map(calendar => {
    let obj = {
      label: calendar.name,
      value: calendar._id
    }

    return obj
  })

  const [selected, setSelected] = useState([]);

  return (
    <div className='CalendarSelectMenu'>
      <label htmlFor='title' className='text-primary'>Select Calendar (
        <small>
          <a href='/account'>Edit</a>
        </small>
        )
      </label>
      
      <MultiSelect
        options={multiSelectData}
        value={selected}
        onChange={setSelected}
        labelledBy='Select'
        hasSelectAll={false}
      />
    </div>
  )
}

export default CalendarSelectMenu;