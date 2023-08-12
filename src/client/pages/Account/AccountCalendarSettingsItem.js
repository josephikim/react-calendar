import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { getErrorMessage } from 'client/utils/errors';
import './AccountCalendarSettingsItem.css';

const AccountCalendarSettingsItem = ({
  id,
  inputType,
  settingType,
  label,
  placeholder,
  calendar,
  createAction,
  updateAction,
  deleteAction,
  validation,
  fixedEditMode
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(calendar ? calendar[settingType] : '');
  const [labelValue, setLabelValue] = useState(label || '');
  const [editMode, setEditMode] = useState(fixedEditMode ?? false);
  const [inputError, setInputError] = useState('');
  const [validateOnChange, setValidateOnChange] = useState(false);

  const isValidEditTarget = calendar && calendar.user_id !== 'system';
  const isValidDeleteTarget = isValidEditTarget && calendar.userDefault === false;

  const handleChange = (e) => {
    const targetValue = e.target.value;

    if (validateOnChange) {
      setInputError(validation(targetValue));
    }
    setInputValue(targetValue);
  };

  const handleSave = () => {
    // check for input errors
    const inputErrorFound = validation(inputValue);

    if (inputErrorFound) {
      setInputError(inputErrorFound);
      setValidateOnChange(true);
      return;
    }

    if (calendar && calendar[settingType] === inputValue) {
      // no change in input
      alert('No change detected. Please try again.');
      return;
    }

    // no input errors, dispatch action
    const data = {
      [settingType]: inputValue
    };

    if (id === 'new-calendar') {
      // create calendar
      dispatch(createAction(data))
        .then(() => {
          alert(`Created calendar: ${data[settingType]}`);
          setInputValue('');
          setInputError('');
          setValidateOnChange(false);
        })
        .catch((e) => {
          const msg = getErrorMessage(e);
          alert(`Error creating calendar: ${msg}`);
          setInputError(msg);
        });
    } else {
      // update calendar

      // insert calendar id
      data.id = calendar.id;

      dispatch(updateAction(data))
        .then(() => {
          alert(`Updated calendar: ${data[settingType]}`);

          if (fixedEditMode == null) {
            setEditMode(false);
          }
          setInputError('');
          setValidateOnChange(false);
        })
        .catch((e) => {
          const msg = getErrorMessage(e);
          alert(`Error updating calendar: ${msg}`);
          setInputError(msg);
        });
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${calendar.name}?`) == false) {
      return;
    }

    dispatch(deleteAction(calendar.id))
      .then(() => {
        alert(`Deleted calendar: ${calendar.name}`);
      })
      .catch((e) => {
        const msg = getErrorMessage(e);
        alert(`Error deleting calendar: ${calendar?.name}: ${msg}`);
        setInputError(msg);
      });
  };

  const handleBlur = (e) => {
    const targetName = e.target.name;

    if (!validateOnChange) {
      setInputError(validation(inputValue));
      setValidateOnChange(true);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setInputValue(calendar ? calendar[settingType] : '');
    setInputError('');
    setValidateOnChange(false);
  };

  const renderButtons = () => {
    if (isValidEditTarget) {
      if (editMode === true) {
        if (isValidDeleteTarget) {
          return (
            <>
              <Button type="button" variant="success" onClick={handleSave}>
                Save
              </Button>
              <Button type="button" variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          );
        } else {
          return (
            <>
              <Button type="button" variant="success" onClick={handleSave}>
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          );
        }
      } else {
        return (
          <Button type="button" variant="primary" disabled={editMode} onClick={handleEdit}>
            Edit
          </Button>
        );
      }
    }
    if (fixedEditMode === true) {
      return (
        <Button type="button" variant="success" onClick={handleSave}>
          Save
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="calendar-settings-item">
      <Row>
        <Col md={2}>
          {calendar && (
            <div className="badges-container">
              {calendar.userDefault === true && (
                <Badge pill variant="primary">
                  Default
                </Badge>
              )}
              {calendar.user_id === 'system' && (
                <Badge pill variant="secondary">
                  System
                </Badge>
              )}
            </div>
          )}
        </Col>
        <Col xs={12} md={10}>
          {label && (
            <Row>
              <Col xs={12}>
                <label htmlFor={settingType}>{labelValue}</label>
              </Col>
            </Row>
          )}
          <Row>
            <Col xs={12} md={7}>
              <Form.Control
                name={settingType}
                type={inputType}
                value={inputValue}
                readOnly={!editMode}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
              />
              {inputError && (
                <div className="input-error text-danger">
                  <small>{inputError}</small>
                </div>
              )}
            </Col>
            <Col xs={12} md={5}>
              <div className="buttons-container">{renderButtons()}</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AccountCalendarSettingsItem;
