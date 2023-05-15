import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { validateFields } from 'client/validation.js';
import { createEvent, updateEvent, deleteEvent, currentSelectionSelector } from 'client/store/userSlice';
import CalendarSelectMenu from './CalendarSelectMenu';
import CalendarDatePickerDialog from './CalendarDatePickerDialogue';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './CalendarEventForm.css';
import 'react-day-picker/dist/style.css';

const CalendarEventForm = () => {
  const calendars = useSelector((state) => state.user.calendars);
  const currentSelection = useSelector(currentSelectionSelector);
  const defaultCal = calendars.find((calendar) => calendar.userDefault === true);

  const [title, setTitle] = useState({
    value: '',
    validateOnChange: false,
    error: null
  });
  const [desc, setDesc] = useState('');
  const [start, setStart] = useState(currentSelection.slot.start);
  const [end, setEnd] = useState(currentSelection.slot.end);
  const [isAllDay, setIsAllDay] = useState(false);
  const [defaultCalId, setDefaultCalId] = useState(defaultCal.id);
  const [selectedCalId, setSelectedCalId] = useState(defaultCal.id);
  const [isSubmitCalled, setIsSubmitCalled] = useState(false);
  const [timeFormat, setTimeFormat] = useState('h:mm a');
  const [dateFormat, setDateFormat] = useState('y-MM-dd');
  const [error, setError] = useState(null);

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
      if (isAllDay === false && end <= start) {
        alert('Input error: End time should be after start time!');
        return;
      }

      const data = {
        title: title.value,
        desc,
        allDay: isAllDay,
        calendarId: selectedCalId
      };

      // add start and end values
      if (isAllDay === true) {
        const startTimeAsDateObj = new Date(start);
        const endTimeAsDateObj = new Date(end);

        // Set hours, minutes, and seconds to zero
        startTimeAsDateObj.setHours(0, 0, 0);
        endTimeAsDateObj.setHours(0, 0, 0);

        const allDayStartTimeAsISOString = startTimeAsDateObj.toISOString();
        const allDayEndTimeAsISOString = endTimeAsDateObj.toISOString();

        data.start = allDayStartTimeAsISOString;
        data.end = allDayEndTimeAsISOString;
      } else {
        data.start = start;
        data.end = end;
      }

      if (clickedId === 'add-event-btn') {
        // Dispatch createEvent action
        createEvent(data)
          .then(() => {
            alert(`Successfully added new event: "${data.title}"`);
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

        const isEventUpdateValid = checkEventUpdate(event, data);

        if (!isEventUpdateValid) {
          alert('No changes detected!');
          return;
        }

        // If update is valid, dispatch updateEvent action
        data.id = event.id;

        updateEvent(data)
          .then(() => {
            alert(`Successfully updated event: "${data.title}"`);
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

  const checkEventUpdate = (event, update) => {
    const isUpdateValid =
      event.title != update.title ||
      event.desc != update.desc ||
      event.start != update.start ||
      event.end != update.end ||
      event.allDay != update.allDay ||
      event.calendarId != update.calendarId;

    if (isUpdateValid) {
      return true;
    }
    return false;
  };

  const handleDelete = (event) => {
    event.preventDefault();

    // If no valid event selected, do nothing
    if (!currentSelection.event || currentSelection.event.length < 1) return;

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
    const calId = values[0].id;
    if (!calId) return;

    const isNewCalSelected = calId !== selectedCalId;

    if (isNewCalSelected) {
      setSelectedCalId(calId);
    }
  };

  const handleAllDayChange = (event) => {
    const isChecked = event.target.checked;

    if (isChecked !== null) {
      setIsAllDay(isChecked);
    }
  };

  const selectedCal = calendars.find((calendar) => calendar.id === selectedCalId);
  const isSystemCalSelected = selectedCal?.systemCalendar === true;
  const isSlotSelected = currentSelection ? Object.keys(currentSelection.slot).length > 0 : false;

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
            onChange={(e) =>
              setDesc({
                ...desc,
                value: e.target.value
              })
            }
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
                dateFormat={dateFormat}
                primaryValue={start}
                secondaryValue={end}
                setStart={setStart}
                setEnd={setEnd}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={6}>
          <Row>
            <Col>
              <label htmlFor="startTime" className="text-primary">
                Start Time
              </label>

              <input id="startTimeInput"></input>
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
                dateFormat={dateFormat}
                primaryValue={end}
                secondaryValue={start}
                setStart={setStart}
                setEnd={setEnd}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={6}>
          <Row>
            <Col>
              <label htmlFor="endTime" className="text-primary">
                End Time
              </label>

              <input className="endTimeInput"></input>
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
            selected={selectedCal ? [selectedCal] : []}
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
              onClick={(e) => handleSubmit(e, this.id)}
            >
              Add
            </Button>
          )}
          {!isSlotSelected && (
            <Button
              type="submit"
              name="update-event-btn"
              id="update-event-btn"
              className="btn"
              variant="success"
              disabled={isSystemCalSelected}
              onClick={(e) => handleSubmit(e, this.id)}
            >
              Save
            </Button>
          )}
        </Col>

        <Col>
          {!isSlotSelected && (
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
