import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import '../styles/AccountSettingsItem.css';

const AccountSettingsItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(props.defaultValue);
  const error = props.error;
  return (
    <div className='AccountSettingsItem'>
      <Container>
        <Row>
          <Col xs={12} md={6} >
            <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
          </Col>
        </Row>
        <Row className='twoColumn'>
          <Col xs={12} md={6} >
            <Form.Group controlId={props.id}>
              <Form.Control
                name={props.id}
                type={props.type}
                defaultValue={props.defaultValue}
                readOnly={!editMode}
                onChange={(event) => 
                  setValue(event.target.value)
                  
                }
                onBlur={props.id === 'password' ? undefined : props.onBlur}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} >
            <div className='btnGroup'>
              {!editMode &&
                <Button
                  type='button'
                  name='editBtn'
                  variant='primary'
                  onClick={() => setEditMode(true)} >
                  Edit
                </Button>
              }

              {editMode &&
                <Button
                  type='submit'
                  name='saveBtn'
                  variant='success'
                  onClick={props.onSubmit} >
                  Save
                </Button>
              }

              {editMode &&
                <Button
                  type='button'
                  name='cancelBtn'
                  variant='secondary'
                  onClick={() => setEditMode(false)} >
                  Cancel
                </Button>
              }
            </div>
          </Col>
        </Row>

        {error &&
          <Row>
            <Col>
              <div className='error text-danger'>
                <small>{error}</small>
              </div>
            </Col>

          </Row>
        }
      </Container>
    </div>
  )
}

export default AccountSettingsItem;