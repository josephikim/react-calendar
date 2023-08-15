import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TimePicker from 'react-time-picker';
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
import { parseTimePickerValues } from 'client/utils/timePicker';
import { getErrorMessage } from 'client/utils/errors';
import { Row, Col, Button, Form } from 'react-bootstrap';
import CalendarSelectMenu from './CalendarSelectMenu';
import DatePickerDialog from './DatePickerDialog';
import styles from 'client/styles/CalendarEventForm.module.css';
import 'react-day-picker/dist/style.css';
import 'react-time-picker/dist/TimePicker.css';

const CalendarEventForm = ({ currentSelection, calendars, calendarIds, defaultCalendarId }) => {
  const dispatch = useDispatch();

  // component state
  const [title, setTitle] = useState({
    value: currentSelection.event?.title ?? '',
    validateOnChange: false,
    error: ''
  });
  const [desc, setDesc] = useState(currentSelection.event?.desc ?? '');
  const [isAllDay, setIsAllDay] = useState(currentSelection.event?.allDay ?? isAllDaySpan(currentSelection.slot));
  const [start, setStart] = useState(currentSelection.event?.start ?? currentSelection.slot.start);
  const [end, setEnd] = useState(currentSelection.event?.end ?? currentSelection.slot.end);
  const [allDayStart, setAllDayStart] = useState(
    getDayStart(currentSelection.slot?.start ?? currentSelection.event.start)
  );
  const [allDayEnd, setAllDayEnd] = useState(getDayEnd(currentSelection.slot?.end ?? currentSelection.event.end));
  const [calendarSelection, setCalendarSelection] = useState(currentSelection.event?.calendar ?? defaultCalendarId);

  // derived state
  const isSystemEventSelected =
    currentSelection.event && calendars[currentSelection.event.calendar].user_id === 'system';
  const calendarSelectMenuValues = [calendars[calendarSelection]];
  const calendarSelectMenuOptions = calendarIds.map((id) => {
    return {
      id,
      name: calendars[id].name,
      disabled: calendars[id].user_id === 'system'
    };
  });

  useEffect(() => {
    if (currentSelection.event) {
      setTitle({
        value: currentSelection.event.title,
        validateOnChange: false,
        error: ''
      });
      setDesc(currentSelection.event.desc);
      setIsAllDay(currentSelection.event.allDay);
      setStart(currentSelection.event.start);
      setEnd(currentSelection.event.end);
      setCalendarSelection(currentSelection.event.calendar);
    }

    if (currentSelection.slot) {
      setTitle({
        value: '',
        validateOnChange: false,
        error: ''
      });
      setDesc('');
      setIsAllDay(false);
      setStart(currentSelection.slot.start);
      setEnd(currentSelection.slot.end);
      setCalendarSelection(defaultCalendarId);
    }
  }, [currentSelection]);

  const handleTitleChange = (validationFunc, e) => {
    setTitle((data) => {
      return {
        ...data,
        value: e.target.value,
        error: data['validateOnChange'] ? validationFunc(e.target.value) : ''
      };
    });
  };

  const handleTimeChange = (id, timeStr) => {
    const [hour, min] = parseTimePickerValues(timeStr);

    if (id === 'startTime') {
      const newStart = new Date(start);
      newStart.setHours(hour, min);
      setStart(newStart);
    }
    if (id === 'endTime') {
      const newEnd = new Date(end);
      newEnd.setHours(hour, min);
      setEnd(newEnd);
    }
  };

  const onBlur = (validationFunc, e) => {
    if (e.target.id === 'title') {
      if (title['validateOnChange'] === false) {
        setTitle((data) => {
          return {
            ...data,
            validateOnChange: true,
            error: validationFunc(data.value)
          };
        });
      }
    }
    return;
  };

  const handleCalendarSelect = (values) => {
    if (values.length < 1) return;

    const calendarId = values[0].id;

    // No change detected
    if (calendarId === calendarSelection) return;

    setCalendarSelection(calendarId);
  };

  const handleAdd = () => {
    const inputError = validateFields.validateTitle(title.value.trim());

    if (!inputError) {
      // no input errors, submit form

      // serialize Date objects
      const data = {
        title: title.value.trim(),
        desc: desc.trim(),
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: isAllDay,
        calendar: calendarSelection
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
      setTitle((data) => {
        return {
          ...data,
          validateOnChange: true,
          error: inputError
        };
      });
    }
  };

  const handleUpdate = () => {
    const inputError = validateFields.validateTitle(title.value.trim());

    if (!inputError) {
      // no input errors, submit form

      // serialize Date objects
      const data = {
        id: currentSelection.event.id,
        title: title.value.trim(),
        desc: desc.trim(),
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: isAllDay,
        calendar: calendarSelection
      };

      // Check for valid update
      if (!isValidEventUpdate(currentSelection.event, data)) {
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
      setTitle((data) => {
        return {
          ...data,
          validateOnChange: true,
          error: inputError
        };
      });
    }
  };

  const handleDelete = () => {
    // get user confirmation
    if (!confirm('Are you sure you want to delete this event?')) return;

    dispatch(deleteEvent(currentSelection.event.id)).catch((e) => {
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
            value={title.value}
            onChange={(e) => handleTitleChange(validateFields.validateTitle, e)}
            onBlur={(e) => onBlur(validateFields.validateTitle, e)}
          >
            enter title
          </textarea>

          <div className="text-danger">
            <small>{title.error}</small>
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
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          >
            enter description
          </textarea>
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
                // value={isAllDay ? allDayStart : start}
                value={start}
                isDisabled={isSystemEventSelected}
                dateFormat={'y-MM-dd'}
                stateSetter={setStart}
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
                onChange={(value) => handleTimeChange('startTime', value)}
                // value={isAllDay ? allDayStart : start}
                value={start}
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
                // value={isAllDay ? allDayEnd : end}
                value={end}
                isDisabled={isSystemEventSelected}
                dateFormat={'y-MM-dd'}
                stateSetter={setEnd}
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
                onChange={(value) => handleTimeChange('endTime', value)}
                // value={isAllDay ? allDayEnd : end}
                value={end}
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
            checked={isAllDay}
            disabled={isSystemEventSelected}
            onChange={(event) => setIsAllDay(event.target.checked)}
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
          {currentSelection.slot && (
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
          {currentSelection.event && (
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
