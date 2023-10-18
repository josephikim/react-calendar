import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Select } from 'react-dropdown-select';
import { Row, Col, Button } from 'react-bootstrap';
import timezones from 'config/timeZones';
import { validateFields } from 'client/validation';
import { getErrorMessage } from 'client/utils/errors';
import styles from 'client/styles/TimeZoneSettingsItem.module.css';

const TimeZoneSettingsItem = ({ value }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(value);
  const [inputError, setInputError] = useState('');

  const handleSave = () => {
    // check for input errors
    const inputError = validateFields.validateTimeZone(dropdownValue);

    if (inputError) {
      setInputError(inputError);
      return;
    }

    if (dropdownValue === value) {
      // no change in input
      alert('No change detected. Please try again.');
      return;
    }

    // no input errors, dispatch action
    const data = {
      gmt_offset: dropdownValue.value,
      desc: dropdownValue.label
    };

    console.log('dispatching update action...');
    // dispatch(updateTimeZone(data))
    //   .then(() => {
    //     alert(`Updated time zone: ${data.desc}`);

    //     setEditMode(false);
    //     setInputError('');
    //   })
    //   .catch((e) => {
    //     const msg = getErrorMessage(e);
    //     alert(`Error updating time zone: ${msg}`);
    //     setInputError(msg);
    //   });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setDropdownValue(value);
  };

  const handleDropdownSelect = (values) => {
    if (values.length < 1) return;

    const gmt_offset = values[0].value;

    // No change detected
    if (gmt_offset === value) return;

    setDropdownValue(gmt_offset);
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

  const dropdownOptions = timezones.map((entry) => ({
    value: entry.gmt_offset,
    label: entry.desc
  }));

  dropdownOptions.sort((a, b) => parseInt(a.value) < parseInt(b.value));

  // selected dropdown values
  const dropdownValues = dropdownOptions.filter((option) => option.value === value);

  return (
    <div className={styles.container}>
      <Row>
        <Col lg={4}></Col>
        <Col lg={4}>
          <label className={styles.label} htmlFor="timezone">
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
