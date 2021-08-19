import React, { useState } from 'react';
import { connect } from 'react-redux';
import MultiSelect from 'react-multi-select-component';

import '../libs/react-bootstrap-multiselect/bootstrap-multiselect.css';

const CalendarSelectMenu = () => {
  const calendars = [
    {
      label: 'One',
      value: 'one',
      disabled: true
    },
    {
      label: 'Two',
      value: 'two',
    },
    { 
      label: 'Three',
      value: 'three',
    },
  ]

  const [selected, setSelected] = useState([]);

  return (
    <div className='CalendarSelectMenu'>
      <label htmlFor='title' className='text-primary'>Select Calendars (
        <small>
          <a href='/account'>Customize</a>
        </small>
        )
      </label>
      
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <MultiSelect
        options={calendars}
        value={selected}
        onChange={setSelected}
        labelledBy="Select"
        hasSelectAll
      />
    </div>
  )
}

const mapActionsToProps = {
}

export default connect(null, mapActionsToProps)(CalendarSelectMenu);