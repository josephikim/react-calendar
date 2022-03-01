import React from 'react';

import '../styles/Checkbox.css';

const Checkbox = (props) => {
  return (
    <input type="checkbox" id={props.id} checked={props.checked} onChange={(event) => props.handleChange(event)} />
  );
};

export default Checkbox;
