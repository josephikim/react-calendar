import React from 'react';
import { Row, Col, Form, Badge, Button } from 'react-bootstrap';

import '../styles/CalendarSettingsItem.css';

const CalendarSettingsItem = (props) => {
  const error = props.error;
  const onBlur = props.onBlur;
  const readOnly = !props.editMode;

  return (
    <div className="CalendarSettingsItem">
      <Row>
        <Col xs={12} md={2}></Col>
        <Col xs={12} md={10}>
          <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
        </Col>
      </Row>

      <Row className="threeColumn">
        <Col xs={12} md={2} className="badges">
          {props.isDefault && (
            <Badge pill variant="secondary">
              Default
            </Badge>
          )}
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId={props.id}>
            <Form.Control
              name={props.id}
              type={props.type}
              placeholder={props.placeholder}
              value={props.value}
              readOnly={readOnly}
              onBlur={onBlur}
              onChange={(event) => props.onChange(event)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <div className="btnGroup">
            {!props.editMode && (
              <Button
                type="button"
                name="editBtn"
                variant="primary"
                disabled={props.disabled}
                onClick={() => props.onEdit(props.id)}
              >
                Edit
              </Button>
            )}
            {props.editMode && (
              <Button
                type="submit"
                name="saveBtn"
                variant="success"
                onClick={(event) => props.onSubmit(event, props.id)}
              >
                Save
              </Button>
            )}
            {props.editMode && props.id !== 'newCalendar' && (
              <Button type="button" name="cancelBtn" variant="secondary" onClick={() => props.onCancel(props.id)}>
                Cancel
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <div className="error text-danger">
              <small>{error}</small>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CalendarSettingsItem;
