import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import TimePicker from 'react-time-picker';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { validateFields } from 'client/validation.js';
import { createEvent, updateEvent, deleteEvent, currentSelectionSelector } from 'client/store/userSlice';
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
  // Redux selectors
  const calendars = useSelector((state) => state.user.calendars);
  const viewSelection = useSelector((state) => state.user.viewSelection);
  const currentSelection = useSelector(currentSelectionSelector);

  // Derived states
  const defaultCal = calendars.find((calendar) => calendar.userDefault === true);
  const selectedCal = calendars.find((calendar) => calendar.id === currentSelection?.event.calendar);
  const isSystemCalSelected = selectedCal?.systemCalendar === true;
  const isSlotSelected = Object.keys(currentSelection.slot).length > 0;
  const isEventSelected = Object.keys(currentSelection.event).length > 0;

  // State initialization helpers
  const getInitialAllDayStart = () => {
    if (isEventSelected) {
      return getDayStart(currentSelection.event.start);
    } else {
      return getDayStart(currentSelection.slot.start);
    }
  };

  const getInitialAllDayEnd = () => {
    if (isEventSelected) {
      if (currentSelection.event.allDay === true) {
        return currentSelection.event.end;
      }
      return getDayEnd(currentSelection.event.end);
    } else {
      if (isAllDaySpan(currentSelection.slot.start, currentSelection.slot.end)) {
        return currentSelection.slot.end;
      }
      return getDayEnd(currentSelection.slot.end);
    }
  };

  // Initialize component state

  // stores strings
  const [title, setTitle] = useState({
    value: currentSelection.event.title ?? '',
    validateOnChange: false,
    error: null
  });
  const [desc, setDesc] = useState(currentSelection.event.desc ?? '');
  const [selectedCalId, setSelectedCalId] = useState(selectedCal?.id ?? defaultCal.id);
  const [timeFormat, setTimeFormat] = useState('h:mm a');
  const [dateFormat, setDateFormat] = useState('y-MM-dd');
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
  const [start, setStart] = useState(currentSelection.event.start ?? currentSelection.slot.start);
  const [end, setEnd] = useState(currentSelection.event.end ?? currentSelection.slot.end);
  const [allDayStart, setAllDayStart] = useState(getInitialAllDayStart());
  const [allDayEnd, setAllDayEnd] = useState(getInitialAllDayEnd());

  // Hook for updating state based on currentSelection change (allDay fields will be handled in another hook)
  useEffect(() => {
    const titleUpdate = {
      value: isEventSelected ? currentSelection.event.title : lastSelectedType === 'slot' ? title.value : '',
      validateOnChange: false,
      error: null
    };

    setTitle(titleUpdate);
    setDesc(isEventSelected ? currentSelection.event.desc : lastSelectedType === 'slot' ? desc : '');
    setLastSelectedType(isEventSelected ? 'event' : 'slot');
    setError(null);

    // Set start/end fields
    if (isSlotSelected) {
      const isSingleDayAllDaySlot = isSingleDayAllDaySpan(currentSelection.slot.start, currentSelection.slot.end);

      const updateStartTime = isSingleDayAllDaySlot
        ? setStart(getSmartStart(currentSelection.slot.start))
        : setStart(currentSelection.slot.start);
      const updateEndTime = isSingleDayAllDaySlot
        ? setEnd(getSmartEnd(currentSelection.slot.end))
        : setEnd(currentSelection.slot.end);

      Promise.all([updateStartTime, updateEndTime]);
    } else {
      // Event is selected
      const updateEventTimes = [setStart(currentSelection.event.start), setEnd(currentSelection.event.end)];
      Promise.all(updateEventTimes);
    }
  }, [currentSelection]);

  // Hook for updating allDay fields based on start time change
  useEffect(() => {
    const isValidStart = isValidStartTime(start, end);

    if (!isValidStart) {
      const newEnd = new Date(start);
      newEnd.setHours(start.getHours() + 1);
      setEnd(newEnd);
    } else {
      updateAllDayStates(start, end);
    }
  }, [start]);

  // Hook for updating allDay fields based on end time change
  useEffect(() => {
    const isValidEnd = isValidEndTime(start, end);

    if (!isValidEnd) {
      const newStart = new Date(end);
      newStart.setHours(end.getHours() - 1);
      setStart(newStart);
    } else {
      updateAllDayStates(start, end);
    }
  }, [end]);

  // Helper for updating all day fields
  const updateAllDayStates = (start, end) => {
    const isAllDaySpanCheck = isAllDaySpan(start, end);
    const updateIsAllDay = setIsAllDay(isAllDaySpanCheck);
    const updateAllDayStart = setAllDayStart(isAllDaySpanCheck ? start : getDayStart(start));
    const updateAllDayEnd = setAllDayEnd(isAllDaySpanCheck ? end : getDayEnd(end));
    Promise.all([updateIsAllDay, updateAllDayStart, updateAllDayEnd]);
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
      if (!isAllDay && !isValidEndTime(start, end)) {
        alert('Input error: End time should be after start time!');
        return;
      }

      // convert Date objs to strings
      const update = {
        title: title.value,
        desc,
        start: isAllDay ? allDayStart.toISOString() : start.toISOString(),
        end: isAllDay ? allDayEnd.toISOString() : end.toISOString(),
        allDay: isAllDay === true ?? isAllDaySpan(start, end),
        calendar: selectedCalId
      };

      if (clickedId === 'add-event-btn') {
        // Dispatch createEvent action
        createEvent(update)
          .then(() => {
            alert(`Successfully added new event: "${update.title}"`);
          })
          .catch((e) => {
            const error = e.response ? e.response.data : e;
            alert(`Error creating event: ${error}`);
            setError(error.message);
          });
      }

      if (clickedId === 'update-event-btn') {
        // Check for valid event update
        const { event } = currentSelection;

        if (!isValidEventUpdate(event, update)) {
          alert('No changes to event detected!');
          return;
        }

        // If update is valid, dispatch updateEvent action
        update.id = event.id;

        updateEvent(update)
          .then(() => {
            alert(`Successfully updated event: "${update.title}"`);
          })
          .catch((e) => {
            const error = e.response ? e.response.data : e;
            alert(`Error updating event: ${error}`);
            setError(error.message);
          });
      }
    } else {
      const newTitleState = {
        ...title,
        validateOnChange: true,
        error: titleError
      };

      setTitle(newTitleState);
      setIsSubmitCalled(false);
    }
  };

  const isValidEventUpdate = (event, update) => {
    const isValidUpdate =
      event.title != update.title ||
      event.desc != update.desc ||
      event.start.toISOstring() != update.start ||
      event.end.toISOString() != update.end ||
      event.allDay != update.allDay ||
      event.calendar != update.calendar;

    if (isValidUpdate) {
      return true;
    }
    return false;
  };

  const handleDelete = (event) => {
    event.preventDefault();

    // If no valid event selected, do nothing
    if (!currentSelection.event.id) return;

    // Confirm delete via user input
    const deleteConfirmation = confirm('Are you sure you want to delete this event?');
    if (deleteConfirmation === false) return;

    const eventId = currentSelection.event.id;

    deleteEvent(eventId).catch((e) => {
      const error = e.response ? e.response.data : e;
      alert(`Error deleting calendar: ${error}`);
      setError(error.message);
    });
  };

  const handleCalendarChange = (values) => {
    if (!values || values.length < 1) return;

    const newCalId = values[0].id;
    const isNewCalSelected = newCalId !== selectedCalId;

    if (isNewCalSelected) {
      setSelectedCalId(newCalId);
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
            disabled={isSystemCalSelected}
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
            disabled={isSystemCalSelected}
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
                isDisabled={isSystemCalSelected}
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
                disabled={isSystemCalSelected}
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
                isDisabled={isSystemCalSelected}
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
                disabled={isSystemCalSelected}
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
            disabled={isSystemCalSelected}
            onChange={(event) => handleAllDayChange(event)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <CalendarSelectMenu
            selected={selectedCal ? [selectedCal] : [defaultCal]}
            disabled={isSystemCalSelected}
            onChange={(values) => handleCalendarChange(values)}
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
              disabled={isSystemCalSelected}
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
              disabled={isSystemCalSelected}
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
              disabled={isSystemCalSelected}
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
