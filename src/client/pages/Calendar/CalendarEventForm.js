import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import TimePicker from 'react-time-picker';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { validateFields } from 'client/validation.js';
import { deserializedRbcSelectionSelector } from 'client/store/appSlice';
import { createEvent, updateEvent, deleteEvent } from 'client/store/eventsSlice';
import {
  getDayStart,
  getDayEnd,
  getSmartStart,
  getSmartEnd,
  isValidStartTime,
  isValidEndTime,
  isAllDaySpan,
  isSingleDayAllDaySpan
} from 'client/utils/dates';
import CalendarSelectMenu from './CalendarSelectMenu';
import CalendarDatePickerDialog from './CalendarDatePickerDialog';
import './CalendarEventForm.css';
import 'react-day-picker/dist/style.css';
import 'react-time-picker/dist/TimePicker.css';

const CalendarEventForm = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);
  const viewSelection = useSelector((state) => state.user.viewSelection);
  const currentSelection = useSelector(deserializedRbcSelectionSelector);

  // Derived states
  const defaultCalId = calendarIds.find((k) => calendars[k].userDefault === true);
  const isSystemEventSelected = calendars[currentSelection.event?.calendar]?.user_id === 'system';
  const isSlotSelected = !!currentSelection.slot;
  const isEventSelected = !!currentSelection.event;

  // Initialize component state
  // stores strings
  const [title, setTitle] = useState({
    value: currentSelection.event?.title || '',
    validateOnChange: false,
    error: null
  });
  const [desc, setDesc] = useState(currentSelection.event?.desc || '');
  const [timeFormat, setTimeFormat] = useState('h:mm a');
  const [dateFormat, setDateFormat] = useState('y-MM-dd');
  const [selectedCalendarId, setSelectedCalendarId] = useState(
    Object.keys(calendars).find((k) => calendars[k].userDefault === true)
  );
  const [lastSelectedType, setLastSelectedType] = useState(isEventSelected ? 'event' : 'slot');
  const [error, setError] = useState(null);

  // stores booleans
  const [isAllDay, setIsAllDay] = useState(
    isEventSelected
      ? currentSelection.event.allDay
      : isAllDaySpan(currentSelection.slot.start, currentSelection.slot.end)
  );
  const [isSubmitCalled, setIsSubmitCalled] = useState(false);

  // stores Date objects
  const [start, setStart] = useState(currentSelection.event?.start ?? currentSelection.slot.start);
  const [end, setEnd] = useState(currentSelection.event?.end ?? currentSelection.slot.end);
  const [allDayStart, setAllDayStart] = useState(
    getDayStart(currentSelection.slot?.start || currentSelection.event.start)
  );
  const [allDayEnd, setAllDayEnd] = useState(getDayEnd(currentSelection.slot?.end || currentSelection.event.end));

  // Hook for updating state based on currentSelection change (allDay fields will be updated via another hook)
  useEffect(() => {
    const titleUpdate = {
      value: isEventSelected ? currentSelection.event.title : lastSelectedType === 'slot' ? title.value : '',
      validateOnChange: false,
      error: null
    };

    setTitle(titleUpdate);
    setDesc(isEventSelected ? currentSelection.event.desc : lastSelectedType === 'slot' ? desc : '');
    setSelectedCalendarId(currentSelection.event?.calendar || defaultCalId);
    setLastSelectedType(isEventSelected ? 'event' : 'slot');
    setError(null);

    // Set start/end fields
    if (isSlotSelected) {
      const isSingleDayAllDaySlot = isSingleDayAllDaySpan(currentSelection.slot.start, currentSelection.slot.end);

      const newStartState = isSingleDayAllDaySlot
        ? getSmartStart(currentSelection.slot.start)
        : currentSelection.slot.start;
      const newEndState = isSingleDayAllDaySlot ? getSmartEnd(currentSelection.slot.end) : currentSelection.slot.end;

      setStart(newStartState);
      setEnd(newEndState);
    } else {
      // Event is selected
      setStart(currentSelection.event.start);
      setEnd(currentSelection.event.end);
    }
  }, [currentSelection]);

  // Hook for updating allDay fields based on start time change
  useEffect(() => {
    const isValidStart = isValidStartTime(start, end);
    const isValidEnd = isValidEndTime(start, end);

    if (!isValidStart) {
      const newEnd = new Date(start);
      newEnd.setHours(start.getHours() + 1);
      setEnd(newEnd);
    } else if (!isValidEnd) {
      const newStart = new Date(end);
      newStart.setHours(end.getHours() - 1);
      setStart(newStart);
    } else {
      updateAllDayStates(start, end);
    }
  }, [start, end]);

  // Helper method for updating all day fields
  const updateAllDayStates = (start, end) => {
    const isAllDaySpanCheck = isAllDaySpan(start, end);

    setIsAllDay(isAllDaySpanCheck);
    setAllDayStart(isAllDaySpanCheck ? start : getDayStart(start));
    setAllDayEnd(isAllDaySpanCheck ? end : getDayEnd(end));
  };

  const handleTitleBlur = (validationFunc, e) => {
    e.preventDefault();
    if (title['validateOnChange'] === false && isSubmitCalled === false) {
      const newState = {
        ...title,
        validateOnChange: true,
        error: validationFunc(title.value)
      };

      setTitle(newState);
    }
    return;
  };

  const handleTitleChange = (validationFunc, e) => {
    e.preventDefault();

    const newState = {
      ...title,
      value: e.target.value,
      error: title['validateOnChange'] ? validationFunc(e.target.value) : null
    };

    setTitle(newState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const clickedId = event.target.id;
    const titleError = validateFields.validateTitle(title.value);

    if (titleError === false) {
      // if no error, submit form

      // Check for valid end time
      if (!isValidEndTime(start, end)) {
        alert('Input error: End time should be after start time!');
        return;
      }

      // convert Date objs to strings
      const update = {
        title: title.value,
        desc,
        start: isAllDay === true ? allDayStart.toISOString() : start.toISOString(),
        end: isAllDay === true ? allDayEnd.toISOString() : end.toISOString(),
        allDay: isAllDay || isAllDaySpan(start, end),
        calendar: selectedCalendarId
      };

      if (clickedId === 'add-event-btn') {
        // Dispatch createEvent action
        dispatch(createEvent(update))
          .then(() => {
            alert(`Successfully added new event: "${update.title}"`);
          })
          .catch((e) => {
            const error = e.response?.data ?? e;
            alert(`Error creating event: ${error}`);
            setError(error.message);
          });
      }

      if (clickedId === 'update-event-btn') {
        const { event } = currentSelection;

        if (!event) return;

        // Check for valid update
        if (!isValidEventUpdate(event, update)) {
          alert('No changes to event detected!');
          return;
        }

        // If valid update, dispatch updateEvent action
        update.id = event.id;

        dispatch(updateEvent(update))
          .then(() => {
            alert(`Successfully updated event: "${update.title}"`);
          })
          .catch((e) => {
            const error = e.response?.data ?? e;
            alert(`Error updating event: ${error}`);
            setError(error.message);
          });
      }
    } else {
      const titleUpdate = {
        ...title,
        validateOnChange: true,
        error: titleError
      };

      setTitle(titleUpdate);
      setIsSubmitCalled(false);
    }
  };

  const handleDelete = (event) => {
    event.preventDefault();

    // If no valid event selected, do nothing
    if (!currentSelection.event.id) return;

    // Confirm delete via user input
    const deleteConfirmation = confirm('Are you sure you want to delete this event?');
    if (deleteConfirmation === false) return;

    const id = currentSelection.event.id;

    dispatch(deleteEvent(id)).catch((e) => {
      const error = e.response?.data ?? e;
      alert(`Error deleting event: ${error}`);
      setError(error.message);
    });
  };

  const isValidEventUpdate = (event, update) => {
    const isValidUpdate =
      event.title != update.title ||
      event.desc != update.desc ||
      event.start.toISOString() != update.start ||
      event.end.toISOString() != update.end ||
      event.allDay != update.allDay ||
      event.calendar != update.calendar;

    if (isValidUpdate) {
      return true;
    }
    return false;
  };

  const handleCalendarChange = (values) => {
    if (!values || values.length < 1) return;

    const calendarId = Object.keys(calendars).find((k) => calendars[k].name === values[0].name);
    const isNewCalSelected = calendarId !== selectedCalendarId;

    if (isNewCalSelected) {
      setSelectedCalendarId(calendarId);
    }
  };

  const handleAllDayChange = (event) => {
    const isChecked = event.target.checked;

    if (isChecked !== null) {
      setIsAllDay(isChecked);
    }
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

  const parseTimePickerValues = (timeStr) => {
    const arr = timeStr.split(':');
    if (arr.length < 2) alert('Invalid time entered!');

    const hour = parseInt(arr[0]);
    const min = parseInt(arr[1]);
    return [hour, min];
  };

  return (
    <Form className="CalendarEventForm">
      <Row>
        <Col>
          <label htmlFor="title" className="text-primary">
            Event Title (required)
          </label>

          <textarea
            id="title"
            name="title"
            className="input"
            disabled={isSystemEventSelected}
            rows="1"
            value={title.value}
            onChange={(e) => handleTitleChange(validateFields.validateTitle, e)}
            onBlur={(e) => handleTitleBlur(validateFields.validateTitle, e)}
          >
            enter title
          </textarea>

          <div className="text-danger">
            <small>{title.error}</small>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <label htmlFor="desc" className="text-primary">
            Event Description
          </label>

          <textarea
            id="desc"
            name="desc"
            className="input"
            disabled={isSystemEventSelected}
            rows="6"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          >
            enter description
          </textarea>
        </Col>
      </Row>

      <Row className="two-column">
        <Col xs={6}>
          <Row>
            <Col>
              <label htmlFor="startDate" className="text-primary">
                Start Date
              </label>
              <CalendarDatePickerDialog
                inputId="startDate"
                isDisabled={isSystemEventSelected}
                dateFormat={dateFormat}
                value={isAllDay ? allDayStart : start}
                setStart={setStart}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={6}>
          <Row>
            <Col>
              <label className="text-primary">Start Time</label>
              <TimePicker
                disableClock
                clearIcon={null}
                disabled={isSystemEventSelected}
                onChange={(value) => handleTimeChange('startTime', value)}
                value={isAllDay ? allDayStart : start}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="two-column">
        <Col xs={6}>
          <Row>
            <Col>
              <label htmlFor="endDate" className="text-primary">
                End Date
              </label>

              <CalendarDatePickerDialog
                inputId="endDate"
                isDisabled={isSystemEventSelected}
                dateFormat={dateFormat}
                value={isAllDay ? allDayEnd : end}
                setEnd={setEnd}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={6}>
          <Row>
            <Col>
              <label className="text-primary">End Time</label>
              <TimePicker
                disableClock
                clearIcon={null}
                disabled={isSystemEventSelected}
                onChange={(value) => handleTimeChange('endTime', value)}
                value={isAllDay ? allDayEnd : end}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col>
          <label htmlFor="all-day" className="text-primary">
            All Day Event
          </label>

          <Form.Check
            type="checkbox"
            id="all-day"
            checked={isAllDay}
            disabled={isSystemEventSelected}
            onChange={(event) => handleAllDayChange(event)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <CalendarSelectMenu
            selected={[calendars[selectedCalendarId]]}
            disabled={isSystemEventSelected}
            onChange={handleCalendarChange}
          />
        </Col>
      </Row>

      <Row className="two-column">
        <Col>
          {isSlotSelected && (
            <Button
              type="submit"
              name="add-event-btn"
              id="add-event-btn"
              className="btn"
              variant="primary"
              disabled={isSystemEventSelected}
              onMouseDown={() => setIsSubmitCalled(true)}
              onClick={(e) => handleSubmit(e)}
            >
              Add
            </Button>
          )}
          {isEventSelected && (
            <Button
              type="submit"
              name="update-event-btn"
              id="update-event-btn"
              className="btn"
              variant="success"
              disabled={isSystemEventSelected}
              onClick={(e) => handleSubmit(e)}
            >
              Save
            </Button>
          )}
        </Col>

        <Col>
          {isEventSelected && (
            <Button
              name="delete-event-btn"
              id="delete-event-btn"
              className="btn"
              variant="danger"
              disabled={isSystemEventSelected}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default CalendarEventForm;
