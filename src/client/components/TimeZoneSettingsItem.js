import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Select } from 'react-dropdown-select';
import { Row, Col, Button } from 'react-bootstrap';
import timezones from 'config/timeZones';
import { updateUser } from 'client/store/userSlice';
import { validateFields } from 'client/validation';
import { getErrorMessage } from 'client/utils/errors';
import styles from 'client/styles/TimeZoneSettingsItem.module.css';

const TimeZoneSettingsItem = ({ userId, gmtOffset }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [timezoneInput, setTimezoneInput] = useState(timezones.find((timezone) => timezone.gmtOffset === gmtOffset));
  const [inputError, setInputError] = useState('');

  const handleSave = () => {
    // check for input errors
    const inputError = validateFields.validateTimeZone(timezoneInput.gmtOffset.toString());

    if (inputError) {
      setInputError(inputError);
      return;
    }

    if (timezoneInput.gmtOffset === gmtOffset) {
      // no change in input
      alert('No change detected. Please try again.');
      return;
    }

    // no input errors, dispatch action
    const data = {
      userId,
      ...timezoneInput
    };

    dispatch(updateUser(data))
      .then(() => {
        alert(`Updated time zone: ${data.desc}`);

        setEditMode(false);
        setInputError('');
      })
      .catch((e) => {
        const msg = getErrorMessage(e);
        alert(`Error updating time zone: ${msg}`);
        setInputError(msg);
      });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTimezoneInput(gmtOffset);
  };

  const handleDropdownSelect = (values) => {
    if (values.length < 1) return;

    const input = values[0];

    setTimezoneInput(input);
  };

  const renderButtons = () => {
    return (
      <Col lg={4}>
        {editMode === true && (
          <>
            <Button className={styles.button} type="button" variant="success" onClick={handleSave}>
              Save
            </Button>
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
  };

  const dropdownOptions = timezones.sort((a, b) => a.gmtOffset < b.gmtOffset);

  // selected dropdown values
  const dropdownValues = dropdownOptions.filter((option) => option.gmtOffset === timezoneInput.gmtOffset);

  return (
    <div className={styles.container}>
      <Row>
        <Col lg={4}></Col>
        <Col lg={4}>
          <label className={styles.label} htmlFor="time_zone">
            Time Zone
          </label>
        </Col>
      </Row>
      <Row>
        <Col lg={4}></Col>
        <Col lg={4}>
          <Select
            name="time_zone"
            placeholder="Select time zone..."
            searchable={false}
            disabled={!editMode}
            values={dropdownValues}
            options={dropdownOptions}
            labelField="desc"
            valueField="gmtOffset"
            onChange={(values) => handleDropdownSelect(values)}
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

export default TimeZoneSettingsItem;
