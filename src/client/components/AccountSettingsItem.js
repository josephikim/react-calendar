import React from 'react';
import { Form } from 'react-bootstrap';

import '../styles/AccountSettingsItem.css';

const AccountSettingsItem = (props) => {
  return (
    <div className='AccountSettingsItem'>
      <Form.Group controlId={props.id}>
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          name={props.id}
          type={props.type}
          value={props.defaultValue}
          readOnly={props.readOnly}
          onChange={props.onChange}
          onBlur={props.id === 'passwordConfirm' ? undefined : props.onBlur}
        />
      </Form.Group>

    </div>
  )
}

export default AccountSettingsItem;