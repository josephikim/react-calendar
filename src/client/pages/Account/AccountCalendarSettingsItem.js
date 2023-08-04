import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Form, Badge, Button } from 'react-bootstrap';

import './AccountCalendarSettingsItem.css';

const AccountCalendarSettingsItem = (props) => {
  const roles = useSelector((state) => state.user.roles);

  const isAdminUser = roles.some((role) => role === 'admin');
  const error = props.error;
  const onBlur = props.onBlur;
  const readOnly = !props.editMode;

  return (
    <div className="AccountCalendarSettingsItem">
      <Row>
        <Col xs={12} md={2}></Col>
        <Col xs={12} md={10}>
          <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
        </Col>
      </Row>

      <Row className="threeColumn">
        <Col xs={12} md={2} className="badges">
          {props.isDefaultCalendar && (
            <Badge pill variant="secondary">
              Default
            </Badge>
          )}
          {props.isSystemCalendar && (
            <Badge pill variant="secondary">
              System
            </Badge>
          )}
        </Col>
        <Col xs={12} md={5}>
          <Form.Group controlId={props.id}>
            <Form.Control
              type={props.type}
              placeholder={props.placeholder}
              value={props.value}
              readOnly={readOnly}
              onBlur={onBlur}
              onChange={(event) => props.onChange(event)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={5}>
          <div className="btnGroup">
            {!props.editMode && (
              <Button
                type="submit"
                name="editBtn"
                variant="primary"
                disabled={props.isSystemCalendar && isAdminUser === false}
                onClick={() => props.onEdit(props.id)}
              >
                Edit
              </Button>
            )}
            {!props.editMode &&
              !props.isDefaultCalendar &&
              props.id !== 'newCalendar' &&
              !(props.isSystemCalendar && isAdminUser === false) && (
                <Button type="submit" name="deleteBtn" variant="danger" onClick={() => props.onDelete(props.id)}>
                  Delete
                </Button>
              )}
            {props.editMode && (
              <Button type="submit" name="saveBtn" variant="success" onClick={(event) => props.onSubmit(event, props.id)}>
                Save
              </Button>
            )}
            {props.editMode && props.id !== 'newCalendar' && (
              <Button type="submit" name="cancelBtn" variant="secondary" onClick={() => props.onCancel(props.id)}>
                Cancel
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col xs={12} md={2}></Col>
          <Col xs={12} md={10}>
            <div className="error text-danger">
              <small>{error}</small>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AccountCalendarSettingsItem;
