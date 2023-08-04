import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import './AccountUserSettingsItem.css';

const AccountUserSettingsItem = (props) => {
  const newPasswordComponent = props.id === 'newPassword';
  const onBlur = props.onBlur ?? null;

  return (
    <div className="AccountUserSettingsItem">
      <Row>
        <Col xs={12} md={2}></Col>
        <Col xs={12} md={10}>
          <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
        </Col>
      </Row>

      <Row className="threeColumn">
        <Col xs={12} md={2} className="badges"></Col>
        <Col xs={12} md={5}>
          <Form.Group controlId={props.id}>
            <Form.Control
              name={props.id}
              type={props.type}
              value={props.value}
              readOnly={!props.editMode}
              onChange={(event) => props.onChange(event)}
              onBlur={(event) => (props.id === 'password' ? undefined : onBlur(event))}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={5}>
          {!newPasswordComponent && (
            <div className="btnGroup">
              {!props.editMode && (
                <Button type="submit" name="editBtn" variant="primary" onClick={() => props.onEdit(props.id)}>
                  Edit
                </Button>
              )}
              {props.editMode && (
                <Button type="submit" name="saveBtn" variant="success" onClick={(event) => props.onSubmit(event)}>
                  Save
                </Button>
              )}
              {props.editMode && (
                <Button type="submit" name="cancelBtn" variant="secondary" onClick={() => props.onCancel(props.id)}>
                  Cancel
                </Button>
              )}
            </div>
          )}
        </Col>
      </Row>

      {props.error && (
        <Row>
          <Col xs={12} md={2}></Col>
          <Col xs={12} md={10}>
            <div className="error text-danger">
              <small>{props.error}</small>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AccountUserSettingsItem;
