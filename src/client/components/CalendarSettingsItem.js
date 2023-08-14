import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { getErrorMessage } from 'client/utils/errors';
import styles from 'client/styles/CalendarSettingsItem.module.css';

const CalendarSettingsItem = ({
  id,
  userId,
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

  const isEditable = calendar?.user_id === userId;
  const isDeleteable = isEditable && calendar.userDefault === false;
  const isBadged = calendar?.userDefault === true || calendar?.user_id === 'system';

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
    if (fixedEditMode === true) {
      return (
        <Col lg={4}>
          <Button className={styles.button} type="button" variant="success" onClick={handleSave}>
            Save
          </Button>
        </Col>
      );
    }

    if (isEditable) {
      return (
        <Col lg={4}>
          {editMode === true && (
            <>
              <Button className={styles.button} type="button" variant="success" onClick={handleSave}>
                Save
              </Button>
              {isDeleteable && (
                <Button className={styles.button} type="button" variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button className={styles.button} type="button" variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          )}
          {editMode === false && (
            <Button className={styles.button} type="button" variant="primary" disabled={editMode} onClick={handleEdit}>
              Edit
            </Button>
          )}
        </Col>
      );
    }

    return <Col lg={4}></Col>;
  };

  const renderBadges = () => {
    if (isBadged) {
      return (
        <Col lg={4}>
          <div className={styles.badgesContainer}>
            {calendar.userDefault === true && (
              <Badge style={{ width: '70px', padding: '0.5rem' }} pill variant="primary">
                Default
              </Badge>
            )}
            {calendar.user_id === 'system' && (
              <Badge style={{ width: '70px', padding: '0.5rem' }} pill variant="secondary">
                System
              </Badge>
            )}
          </div>
        </Col>
      );
    } else {
      return <Col lg={4}></Col>;
    }
  };

  const renderLabel = () => {
    if (label) {
      return (
        <Row>
          <Col lg={4}></Col>
          <Col lg={4}>
            <label className={styles.label} htmlFor={settingType}>
              {labelValue}
            </label>
          </Col>
        </Row>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      {renderLabel()}
      <Row>
        {renderBadges()}
        <Col lg={4}>
          <Form.Control
            className={styles.input}
            name={settingType}
            type={inputType}
            value={inputValue}
            readOnly={!editMode}
            onChange={(e) => handleChange(e)}
            onBlur={(e) => handleBlur(e)}
          />
        </Col>
        {renderButtons()}
      </Row>

      {inputError && (
        <Row>
          <Col lg={4}></Col>
          <Col lg={8}>
            <div className="input-error text-danger mt-2 mb-2">
              <small>{inputError}</small>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CalendarSettingsItem;
