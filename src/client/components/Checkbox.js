import React from 'react';

import 'client/styles/Checkbox.css';

const Checkbox = ({ id, checked, handleChange }) => (
  <div className="Checkbox">
    <input type="checkbox" id={id} checked={checked} onChange={(event) => handleChange(event)} />
  </div>
);

export default Checkbox;
