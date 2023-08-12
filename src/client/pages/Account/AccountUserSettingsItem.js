import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { getErrorMessage } from 'client/utils/errors';

import './AccountUserSettingsItem.css';

const AccountUserSettingsItem = ({
  inputType,
  settingType,
  label,
  value,
  action,
  validation,
  confirmationRequired
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(value);
  const [labelValue, setLabelValue] = useState(label);
  const [editMode, setEditMode] = useState(false);
  const [inputError, setInputError] = useState('');
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [newInputValue, setNewInputValue] = useState('');
  const [newEditMode, setNewEditMode] = useState(false);
  const [newInputError, setNewInputError] = useState('');
  const [newValidateOnChange, setNewValidateOnChange] = useState(false);

  const handleChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName.startsWith('new-')) {
      if (newValidateOnChange) {
        setNewInputError(validation(targetValue));
      }
      setNewInputValue(targetValue);
    } else {
      if (validateOnChange) {
        setInputError(validation(targetValue));
      }
      setInputValue(targetValue);
    }
  };

  const handleSave = () => {
    if (!confirmationRequired) {
      // check for input errors
      const inputErrorFound = validation(inputValue);

      if (inputErrorFound) {
        setInputError(inputErrorFound);
        setValidateOnChange(true);
        return;
      }

      if (inputValue === value) {
        // no change in input
        alert('No change detected. Please try again.');
        return;
      }
    } else {
      // check for input errors
      const newInputErrorFound = validation(newInputValue);

      if (newInputErrorFound) {
        setNewInputError(newInputErrorFound);
        setNewValidateOnChange(true);
        return;
      }

      if (inputValue === newInputValue) {
        // identical input and newInput
        alert(`${settingType}s cannot match`);
        return;
      }
    }

    // no input errors, dispatch action
    const data = {
      [settingType]: inputValue
    };

    if (confirmationRequired) {
      // format property name with camelcase
      const newInputProperty = 'new' + settingType.charAt(0).toUpperCase() + settingType.slice(1);
      data[newInputProperty] = newInputValue;
    }

    dispatch(action(data))
      .then(() => {
        alert(`Updated ${settingType}`);

        if (confirmationRequired) {
          setNewEditMode(false);
          setNewInputValue('');
          setNewInputError('');
          setNewValidateOnChange(false);
          setLabelValue(label);
        }
        setEditMode(false);
        setInputError('');
        setValidateOnChange(false);
      })
      .catch((e) => {
        const msg = getErrorMessage(e);
        alert(`Error updating user: ${msg}`);
        setInputError(msg);
      });
  };

  const handleBlur = (e) => {
    const targetName = e.target.name;

    if (confirmationRequired && ['password'].includes(targetName)) return;

    if (targetName.startsWith('new-')) {
      if (!newValidateOnChange) {
        setInputError(validation(newInputValue));
        setNewValidateOnChange(true);
      }
    } else {
      if (!validateOnChange) {
        setInputError(validation(inputValue));
        setValidateOnChange(true);
      }
    }
  };

  const handleEdit = () => {
    if (confirmationRequired) {
      setNewEditMode(true);
      setLabelValue(`Confirm current ${settingType}`);
      if (['password'].includes(settingType)) {
        setInputValue('');
      }
    }
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    if (confirmationRequired) {
      setNewEditMode(false);
      setLabelValue(label);
      setNewInputValue('');
      setNewInputError('');
      setNewValidateOnChange(false);
    }
    setEditMode(false);
    setInputValue(value);
    setInputError('');
    setValidateOnChange(false);
  };

  return (
    <div className="user-settings-item">
      <Row>
        <Col md={2}></Col>
        <Col xs={12} md={10}>
          <Row>
            <Col xs={12}>
              <label htmlFor={settingType}>{labelValue}</label>
            </Col>
          </Row>
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
              {newEditMode && (
                <>
                  <label htmlFor={`new-${settingType}`}>{`New ${settingType}`}</label>
                  <Form.Control
                    name={`new-${settingType}`}
                    type={inputType}
                    value={newInputValue}
                    onChange={(e) => handleChange(e)}
                    onBlur={(e) => handleBlur(e)}
                  />
                  {newInputError && (
                    <div className="new-input-error text-danger">
                      <small>{newInputError}</small>
                    </div>
                  )}
                </>
              )}
            </Col>
            <Col xs={12} md={5}>
              <div className="buttons-container">
                {!editMode && (
                  <Button type="button" variant="primary" disabled={editMode} onClick={handleEdit}>
                    Edit
                  </Button>
                )}
                {editMode && (
                  <>
                    <Button type="button" variant="success" onClick={handleSave}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AccountUserSettingsItem;
