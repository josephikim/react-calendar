import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';
import TimePicker from 'react-time-picker';
import _ from 'lodash';
import {
  deserializedRbcSelectionSelector,
  serializedRbcSelectionSelector,
  selectRbcSelection
} from 'client/store/appSlice';
import { createEvent, updateEvent, deleteEvent } from 'client/store/eventsSlice';
import { validateFields } from 'client/validation.js';
import {
  getDayStart,
  getDayEnd,
  isValidStartTime,
  isValidEndTime,
  isAllDaySpan,
  isSingleDayAllDaySpan
} from 'client/utils/dates';
import { isValidEventUpdate } from 'client/utils/events';
import { addToLocalStorageObject } from 'client/utils/localStorage';
import { parseTimePickerValues } from 'client/utils/timePicker';
import { getErrorMessage } from 'client/utils/errors';
import { Row, Col, Button, Form } from 'react-bootstrap';
import CalendarSelectMenu from './CalendarSelectMenu';
import DatePickerDialog from './DatePickerDialog';
import styles from 'client/styles/CalendarEventForm.module.css';
import 'react-day-picker/dist/style.css';
import 'react-time-picker/dist/TimePicker.css';

const CalendarEventForm = ({ rbcSelection, calendars, calendarIds, defaultCalendarId }) => {
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    title: {
      value: rbcSelection.event?.title ?? '',
      validateOnChange: false,
      error: ''
    },
    desc: rbcSelection.event?.desc ?? '',
    start: new Date(rbcSelection.event?.start ?? rbcSelection.slot.start),
    end: new Date(rbcSelection.event?.end ?? rbcSelection.slot.end),
    allDay: rbcSelection.event?.allDay ?? false,
    calendarId: rbcSelection.event?.calendar ?? defaultCalendarId
  });

  // update form values based on RBC selection
  // useDeepCompareEffect has same signature as useEffect, but allows deep comparison of props
  useDeepCompareEffect(() => {
    if (rbcSelection.event) {
      setFormValues((data) => ({
        title: {
          value: rbcSelection.event.title,
          validateOnChange: false,
          error: ''
        },
        desc: rbcSelection.event.desc,
        start: new Date(rbcSelection.event.start),
        end: new Date(rbcSelection.event.end),
        allDay: rbcSelection.event.allDay,
        calendarId: rbcSelection.event.calendar
      }));
    }

    if (rbcSelection.slot) {
      const startDate = new Date(rbcSelection.slot.start);
      const endDate = new Date(rbcSelection.slot.end);

      const localFormValues = localStorage.getItem('formValues');

      if (localFormValues) {
        const json = JSON.parse(localFormValues);

        // convert start and end values to Date objects
        ['start', 'end'].forEach((key) => {
          if (json[key]) {
            const dateFromJson = new Date(json[key]);
            const dateFromSlot = new Date(rbcSelection.slot[key]);
            dateFromSlot.setHours(dateFromJson.getHours());
            dateFromSlot.setMinutes(dateFromJson.getMinutes());
            dateFromSlot.setSeconds(dateFromJson.getSeconds());
            json[key] = dateFromSlot;
          }
        });

        const newState = {
          title: {
            value: json.title?.value ?? '',
            validateOnChange: json.title?.validateOnChange ?? false,
            error: json.title?.error ?? ''
          },
          desc: json.desc ?? '',
          start: json.start ?? rbcSelection.slot.start,
          end: json.end ?? rbcSelection.slot.end,
          allDay: isAllDaySpan(rbcSelection.slot),
          calendarId: defaultCalendarId
        };

        setFormValues(newState);
      }
      setFormValues({
        title: {
          value: '',
          validateOnChange: false,
          error: ''
        },
        desc: '',
        start: startDate,
        end: endDate,
        allDay: isAllDaySpan(rbcSelection.slot),
        calendarId: defaultCalendarId
      });
    }
  }, [rbcSelection]);

  // set form values on component mount using localStorage values if found
  useEffect(() => {
    const localFormValues = localStorage.getItem('formValues');

    if (localFormValues) {
      const json = JSON.parse(localFormValues);

      // convert start and end values to Date objects
      ['start', 'end'].forEach((key) => {
        if (json[key]) {
          json[key] = new Date(json[key]);
        }
      });

      const newState = {
        ...formValues,
        ...json
      };

      setFormValues(newState);
    }
  }, []);

  // derived state
  const isSystemEventSelected = rbcSelection.event && calendars[rbcSelection.event.calendar].user_id === 'system';
  const calendarSelectMenuValues = [calendars[formValues.calendarId]];
  const calendarSelectMenuOptions = calendarIds.map((id) => {
    return {
      id,
      name: calendars[id].name,
      disabled: calendars[id].user_id === 'system'
    };
  });

  const handleTitleChange = (validationFunc, e) => {
    setFormValues((data) => {
      return {
        ...data,
        title: {
          ...data.title,
          value: e.target.value,
          error: data.title['validateOnChange'] ? validationFunc(e.target.value) : ''
        }
      };
    });
  };

  const handleBlur = (validationFunc, e) => {
    if (e.target.id === 'title') {
      if (formValues.title['validateOnChange'] === false) {
        setFormValues((data) => {
          return {
            ...data,
            title: {
              ...data.title,
              validateOnChange: true,
              error: validationFunc(data.title.value)
            }
          };
        });
      }
      addToLocalStorageObject('formValues', 'title', { ...formValues.title });
    }
    if (e.target.id === 'desc') {
      addToLocalStorageObject('formValues', 'desc', formValues.desc);
    }
  };

  const handleDateSelect = (id, date) => {
    if (id === 'startDate') {
      setFormValues((data) => {
        return {
          ...data,
          start: date
        };
      });
      addToLocalStorageObject('formValues', 'start', date.toISOString());
    }
    if (id === 'endDate') {
      setFormValues((data) => {
        return {
          ...data,
          end: date
        };
      });
      addToLocalStorageObject('formValues', 'end', date.toISOString());
    }
  };

  const handleTimeSelect = (id, timeStr) => {
    const [hour, min] = parseTimePickerValues(timeStr);

    if (id === 'start') {
      const newStart = new Date(formValues.start);
      newStart.setHours(hour, min);

      setFormValues((data) => {
        return {
          ...data,
          start: newStart
        };
      });

      addToLocalStorageObject('formValues', 'start', newStart.toISOString());
    }
    if (id === 'end') {
      const newEnd = new Date(formValues.end);
      newEnd.setHours(hour, min);

      setFormValues((data) => {
        return {
          ...data,
          end: newEnd
        };
      });

      addToLocalStorageObject('formValues', 'end', newEnd.toISOString());
    }
  };

  const handleAllDaySelect = (event) => {
    setFormValues((data) => {
      return {
        ...data,
        allDay: event.target.checked
      };
    });
    addToLocalStorageObject('formValues', 'allDay', event.target.checked);
  };

  const handleCalendarSelect = (values) => {
    if (values.length < 1) return;

    const calendarId = values[0].id;

    // No change detected
    if (calendarId === formValues.calendarId) return;

    setFormValues((data) => {
      return {
        ...data,
        calendarId
      };
    });
    addToLocalStorageObject('formValues', 'calendarId', calendarId);
  };

  const handleAdd = () => {
    const inputError = validateFields.validateTitle(formValues.title.value.trim());

    if (!inputError) {
      // no input errors, submit form

      // serialize Date objects
      const data = {
        title: formValues.title.value.trim(),
        desc: formValues.desc.trim(),
        start: formValues.start,
        end: formValues.end,
        allDay: formValues.allDay,
        calendar: formValues.calendarId
      };

      dispatch(createEvent(data))
        .then(() => {
          alert(`Added new event: "${data.title}"`);
        })
        .catch((e) => {
          const msg = getErrorMessage(e);
          alert(`Error creating event: ${msg}`);
        });
    } else {
      // update title state
      setFormValues((data) => {
        return {
          ...data,
          title: {
            ...data.title,
            validateOnChange: true,
            error: inputError
          }
        };
      });
    }
  };

  const handleUpdate = () => {
    const inputError = validateFields.validateTitle(formValues.title.value.trim());

    if (!inputError) {
      // no input errors, submit form

      // serialize Date objects
      const data = {
        id: rbcSelection.event.id,
        title: formValues.title.value.trim(),
        desc: formValues.desc.trim(),
        start: formValues.start,
        end: formValues.end,
        allDay: formValues.allDay,
        calendar: formValues.calendarId
      };

      // Check for valid update
      if (!isValidEventUpdate(rbcSelection.event, data)) {
        return alert('No changes detected. Please try again.');
      }

      dispatch(updateEvent(data))
        .then(() => {
          alert(`Updated event: "${data.title}"`);
        })
        .catch((e) => {
          const msg = getErrorMessage(e);
          alert(`Error updating event: ${msg}`);
        });
    } else {
      setFormValues((data) => {
        return {
          ...data,
          title: {
            ...data.title,
            validateOnChange: true,
            error: inputError
          }
        };
      });
    }
  };

  const handleDelete = () => {
    // get user confirmation
    if (!confirm('Are you sure you want to delete this event?')) return;

    dispatch(deleteEvent(rbcSelection.event.id)).catch((e) => {
      const msg = getErrorMessage(e);
      alert(`Error deleting event: ${msg}`);
    });
  };

  return (
    <Form className={styles.container}>
      <Row className="mb-3">
        <Col>
          <label htmlFor="title" className="text-primary">
            Event Title (required)
          </label>

          <textarea
            id="title"
            className={styles.textarea}
            disabled={isSystemEventSelected}
            rows="1"
            value={formValues.title.value}
            onChange={(e) => handleTitleChange(validateFields.validateTitle, e)}
            onBlur={(e) => handleBlur(validateFields.validateTitle, e)}
          >
            enter title
          </textarea>

          <div className="text-danger">
            <small>{formValues.title.error}</small>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <label htmlFor="desc" className="text-primary">
            Event Description
          </label>

          <textarea
            id="desc"
            className={styles.textarea}
            disabled={isSystemEventSelected}
            rows="6"
            value={formValues.desc}
            onChange={(e) => setFormValues({ ...formValues, desc: e.target.value })}
            onBlur={(e) => handleBlur(null, e)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <Row>
            <Col>
              <label htmlFor="startDate" className="text-primary">
                Start Date
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <DatePickerDialog
                inputId="startDate"
                date={formValues.start}
                isDisabled={isSystemEventSelected}
                dateFormat={'y-MM-dd'}
                onDateSelect={handleDateSelect}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={6}>
          <Row>
            <Col>
              <label className="text-primary">Start Time</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <TimePicker
                className={styles.timePicker}
                disableClock
                clearIcon={null}
                disabled={isSystemEventSelected}
                onChange={(value) => handleTimeSelect('start', value)}
                value={formValues.start}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <Row>
            <Col>
              <label htmlFor="endDate" className="text-primary">
                End Date
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <DatePickerDialog
                inputId="endDate"
                date={formValues.end}
                isDisabled={isSystemEventSelected}
                dateFormat={'y-MM-dd'}
                onDateSelect={handleDateSelect}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={6}>
          <Row>
            <Col>
              <label className="text-primary">End Time</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <TimePicker
                className={styles.timePicker}
                disableClock
                clearIcon={null}
                disabled={isSystemEventSelected}
                onChange={(value) => handleTimeSelect('end', value)}
                value={formValues.end}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <label htmlFor="all-day" className="text-primary">
            All Day Event
          </label>

          <Form.Check
            type="checkbox"
            id="all-day"
            checked={formValues.allDay}
            disabled={isSystemEventSelected}
            onChange={(e) => handleAllDaySelect(e)}
          />
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <CalendarSelectMenu
            values={calendarSelectMenuValues}
            options={calendarSelectMenuOptions}
            disabled={isSystemEventSelected}
            onChange={handleCalendarSelect}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          {rbcSelection.slot && (
            <Button
              type="button"
              id="add-event-btn"
              className={styles.button}
              variant="primary"
              disabled={isSystemEventSelected}
              onClick={handleAdd}
            >
              Add
            </Button>
          )}
          {rbcSelection.event && (
            <>
              <Button
                type="button"
                id="update-event-btn"
                className={styles.button}
                variant="success"
                disabled={isSystemEventSelected}
                onClick={handleUpdate}
              >
                Save
              </Button>
              <Button
                type="button"
                id="delete-event-btn"
                className={styles.button}
                variant="danger"
                disabled={isSystemEventSelected}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default CalendarEventForm;
