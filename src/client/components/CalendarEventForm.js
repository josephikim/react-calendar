import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';
import TimePicker from 'react-time-picker';
import _ from 'lodash';
import { createEvent, updateEvent, deleteEvent } from 'client/store/eventsSlice';
import { validateFields } from 'client/validation.js';
import { getDayStart, getDayEnd, isAllDaySpan } from 'client/utils/dates';
import { isValidEventUpdate } from 'client/utils/events';
import { isValidTimeSpan } from 'client/utils/dates';
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
    allDayStart: getDayStart(new Date(rbcSelection.event?.start ?? rbcSelection.slot.start)),
    allDayEnd: getDayEnd(new Date(rbcSelection.event?.end ?? rbcSelection.slot.end)),
    allDay: rbcSelection.event?.allDay ?? false,
    calendarId: rbcSelection.event?.calendar ?? defaultCalendarId
  });

  // update form values based on rbc selection
  // useDeepCompareEffect has same signature as useEffect, but allows deep comparison of dependencies
  useDeepCompareEffect(() => {
    if (rbcSelection.event) {
      const update = {
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
      };
      setFormValues((data) => ({
        ...data,
        ...update
      }));
    }

    if (rbcSelection.slot) {
      const localFormValues = localStorage.getItem('formValues');

      if (localFormValues) {
        // update form values using local form values
        // combine dates from rbc selection and times from local form values if available
        const localObj = JSON.parse(localFormValues);

        // convert start and end values to Date objects
        ['start', 'end'].forEach((key) => {
          if (localObj[key]) {
            const dateFromLocal = new Date(localObj[key]);
            const dateFromRbc = new Date(rbcSelection.slot[key]);

            dateFromRbc.setHours(dateFromLocal.getHours());
            dateFromRbc.setMinutes(dateFromLocal.getMinutes());
            dateFromRbc.setSeconds(dateFromLocal.getSeconds());

            localObj[key] = dateFromRbc;
          }
        });

        const update = {
          title: localObj.title ?? {
            value: '',
            validateOnChange: false,
            error: ''
          },
          desc: localObj.desc ?? '',
          start: localObj.start ?? new Date(rbcSelection.slot.start),
          end: localObj.end ?? new Date(rbcSelection.slot.end),
          allDayStart: getDayStart(localObj.start ?? new Date(rbcSelection.slot.start)),
          allDayEnd: getDayEnd(localObj.end ?? new Date(rbcSelection.slot.end)),
          calendarId: localObj.calendarId ?? defaultCalendarId
        };

        setFormValues((data) => ({
          ...data,
          ...update
        }));

        addToLocalStorageObject('formValues', 'start', update.start.toISOString());
        addToLocalStorageObject('formValues', 'end', update.end.toISOString());
      } else {
        // if no local storage data, reset form values
        const update = {
          title: {
            value: '',
            validateOnChange: false,
            error: ''
          },
          desc: '',
          start: new Date(rbcSelection.slot.start),
          end: new Date(rbcSelection.slot.end),
          allDayStart: getDayStart(new Date(rbcSelection.slot.start)),
          allDayEnd: getDayEnd(new Date(rbcSelection.slot.end)),
          calendarId: defaultCalendarId
        };

        setFormValues((data) => ({
          ...data,
          ...update
        }));
      }
    }
  }, [rbcSelection]);

  // set allDay state based on changes to start or end values
  useEffect(() => {
    const allDay = isAllDaySpan(formValues.start, formValues.end);

    setFormValues((data) => ({ ...data, allDay }));
  }, [formValues.start, formValues.end]);

  // set form values on component mount using localStorage values if found
  useEffect(() => {
    const localFormValues = localStorage.getItem('formValues');

    if (localFormValues) {
      const json = JSON.parse(localFormValues);

      delete json.start;
      delete json.end;

      setFormValues({
        ...formValues,
        ...json
      });
    }
  }, []);

  // derived state
  const isSystemEventSelected = rbcSelection.event && calendars[rbcSelection.event.calendar].user_id === 'system';
  const calendarSelectMenuValues = [calendars[formValues.calendarId]];
  const calendarSelectMenuOptions = calendarIds.map((id) => ({
    id,
    name: calendars[id].name,
    disabled: calendars[id].user_id === 'system'
  }));

  const handleTitleChange = (validationFunc, e) => {
    setFormValues((data) => ({
      ...data,
      title: {
        ...data.title,
        value: e.target.value,
        error: data.title['validateOnChange'] ? validationFunc(e.target.value) : ''
      }
    }));
  };

  const handleBlur = (validationFunc, e) => {
    if (e.target.id === 'title') {
      if (formValues.title['validateOnChange'] === false) {
        setFormValues((data) => ({
          ...data,
          title: {
            ...data.title,
            validateOnChange: true,
            error: validationFunc(data.title.value)
          }
        }));
      }
      addToLocalStorageObject('formValues', 'title', { ...formValues.title });
    }
    if (e.target.id === 'desc') {
      addToLocalStorageObject('formValues', 'desc', formValues.desc);
    }
  };

  const handleDateSelect = (id, date) => {
    if (id === 'startDate') {
      setFormValues((data) => ({
        ...data,
        start: date
      }));
      addToLocalStorageObject('formValues', 'start', date.toISOString());
    }

    if (id === 'endDate') {
      setFormValues((data) => ({
        ...data,
        end: date
      }));
      addToLocalStorageObject('formValues', 'end', date.toISOString());
    }
  };

  const handleTimeSelect = (id, timeStr) => {
    const [hour, min] = parseTimePickerValues(timeStr);

    if (id === 'start') {
      const newStart = new Date(formValues.start);
      newStart.setHours(hour, min);

      setFormValues((data) => ({
        ...data,
        start: newStart
      }));

      addToLocalStorageObject('formValues', 'start', newStart.toISOString());
    }

    if (id === 'end') {
      const newEnd = new Date(formValues.end);
      newEnd.setHours(hour, min);

      setFormValues((data) => ({
        ...data,
        end: newEnd
      }));

      addToLocalStorageObject('formValues', 'end', newEnd.toISOString());
    }
  };

  const handleAllDaySelect = (event) => {
    const checked = event.target.checked;

    setFormValues((data) => ({
      ...data,
      allDay: checked
    }));

    addToLocalStorageObject(
      'formValues',
      'start',
      checked ? formValues.allDayStart.toISOString() : formValues.start.toISOString()
    );

    addToLocalStorageObject(
      'formValues',
      'end',
      checked ? formValues.allDayEnd.toISOString() : formValues.end.toISOString()
    );
  };

  const handleCalendarSelect = (values) => {
    if (values.length < 1) return;

    const calendarId = values[0].id;

    // No change detected
    if (calendarId === formValues.calendarId) return;

    setFormValues((data) => ({
      ...data,
      calendarId
    }));

    addToLocalStorageObject('formValues', 'calendarId', calendarId);
  };

  const handleAdd = () => {
    // Check for valid time span
    if (
      !isValidTimeSpan(
        formValues.allDay ? formValues.allDayStart : formValues.start,
        formValues.allday ? formValues.allDayEnd : formValues.end
      )
    ) {
      alert('End time should be after start time. Please try again.');
      return;
    }

    const inputError = validateFields.validateTitle(formValues.title.value.trim());

    if (!inputError) {
      // no input errors, submit form

      // serialize Date objects
      const data = {
        title: formValues.title.value.trim(),
        desc: formValues.desc.trim(),
        start: formValues.allDay ? formValues.allDayStart.toISOString() : formValues.start.toISOString(),
        end: formValues.allday ? formValues.allDayEnd.toISOString() : formValues.end.toISOString(),
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
      setFormValues((data) => ({
        ...data,
        title: {
          ...data.title,
          validateOnChange: true,
          error: inputError
        }
      }));
    }
  };

  const handleUpdate = () => {
    // Check for valid time span
    if (
      !isValidTimeSpan(
        formValues.allDay ? formValues.allDayStart : formValues.start,
        formValues.allday ? formValues.allDayEnd : formValues.end
      )
    ) {
      alert('End time should be after start time. Please try again.');
      return;
    }

    const inputError = validateFields.validateTitle(formValues.title.value.trim());

    if (!inputError) {
      // no input errors, submit form

      // serialize Date objects
      const data = {
        id: rbcSelection.event.id,
        title: formValues.title.value.trim(),
        desc: formValues.desc.trim(),
        start: formValues.allDay ? formValues.allDayStart.toISOString() : formValues.start.toISOString(),
        end: formValues.allday ? formValues.allDayEnd.toISOString() : formValues.end.toISOString(),
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
      setFormValues((data) => ({
        ...data,
        title: {
          ...data.title,
          validateOnChange: true,
          error: inputError
        }
      }));
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
                date={formValues.allDay ? formValues.allDayStart : formValues.start}
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
                value={formValues.allDay ? formValues.allDayStart : formValues.start}
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
                date={formValues.allDay ? formValues.allDayEnd : formValues.end}
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
                value={formValues.allDay ? formValues.allDayEnd : formValues.end}
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
