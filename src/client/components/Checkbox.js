import React from 'react';

const checkboxStyles = {
  width: '24px',
  height: '24px',
  textAlign: 'center',
  verticalAlign: 'middle'
};

const Checkbox = ({ id, checked, handleChange }) => (
  <div>
    <input style={checkboxStyles} type="checkbox" id={id} checked={checked} onChange={(event) => handleChange(event)} />
  </div>
);

export default Checkbox;
