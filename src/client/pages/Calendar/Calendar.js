import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  fetchUserData,
  deserializedEventsSelector,
  deserializedRbcSelectionSelector,
  initCalendarUI
} from 'client/store/userSlice';
import ContentWrapper from 'client/components/ContentWrapper';
import CalendarToggleMenu from './CalendarToggleMenu';
import CalendarEventForm from './CalendarEventForm';
import { Calendar as ReactBigCalendar, dayjsLocalizer } from 'react-big-calendar';
import { Container, Row, Col } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

const Calendar = () => {
  const dispatch = useDispatch();
  const shouldInitData = useRef(true);

  // Redux selectors
  const calendars = useSelector((state) => state.user.calendars);
  const events = useSelector(deserializedEventsSelector);
  const currentSelection = useSelector(deserializedRbcSelectionSelector);

  // Fetch initial user data
  useEffect(() => {
    if (shouldInitData.current) {
      dispatch(fetchUserData());
      dispatch(initCalendarUI());
      shouldInitData.current = false;
    }
  }, []);

  // Styles used for displaying calendar events
  const eventStyleGetter = (event) => {
    const calendar = calendars[event.calendar];

    if (!calendar) return;

    // returns HEX code
    const getCalendarColor = () => {
      return calendar.color;
    };

    const style = {
      backgroundColor: getCalendarColor()
    };

    return {
      style: style
    };
  };

  const handleSelectEvent = (event) => {
    const { event: currentEvent } = currentSelection;

    // If event matches previous selection, do nothing
    const isNewEventSelected = !currentEvent || event.id !== currentEvent.id;

    if (!isNewEventSelected) return;

    const serializedEvent = {
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString()
    };

    dispatch(onSelectEvent(serializedEvent));
  };

  const handleSelectSlot = (slot) => {
    const { slot: currentSlot } = currentSelection;

    // If selected slot matches current slot, do nothing
    if (!isValidSlot(currentSlot, slot)) return;

    const serializedSlot = {
      ...slot,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      slots: slot.slots.map((slot) => slot.toISOString())
    };

    dispatch(onSelectSlot(serializedSlot));
  };

  // Returns true if candidate slot and current slot are unique from each other.
  // Comparisons are made using primitive values of Date objects i.e. date.getTime()
  const isValidSlot = (currentSlot, candidateSlot) => {
    if (!currentSlot) return true;

    const isUnique =
      candidateSlot.start.getTime() !== currentSlot.start.getTime() ||
      candidateSlot.end.getTime() !== currentSlot.end.getTime();

    if (isUnique) return true;

    return false;
  };

  const handleView = (view) => {
    dispatch(onSelectView(view));
  };

  const getVisibleEvents = () => {
    const visibleCalendars = [];

    for (const key in calendars) {
      if (calendars[key].visibility === true) {
        visibleCalendars.push(key);
      }
    }

    const result = events.filter((event) => visibleCalendars.includes(event.calendar));

    return result;
  };

  const render = () => {
    // check for calendar data
    const isCalendarInitialized =
      Object.keys(calendars).length > 0 && (currentSelection.slot || currentSelection.event);

    if (isCalendarInitialized) {
      const events = getVisibleEvents();

      return (
        <Row>
          <Col xs={12} lg={2}>
            <CalendarToggleMenu />
          </Col>
          <Col xs={12} lg={7}>
            <ReactBigCalendar
              selectable
              localizer={localizer}
              events={events}
              defaultView="month"
              onView={(view) => handleView(view)}
              defaultDate={new Date()}
              scrollToTime={new Date(1970, 1, 1, 6)}
              onSelectEvent={(e) => handleSelectEvent(e)}
              onSelectSlot={(slot) => handleSelectSlot(slot)}
              startAccessor={(e) => e.start}
              endAccessor={(e) => e.end}
              eventPropGetter={(e) => eventStyleGetter(e)}
            />
          </Col>
          <Col xs={12} lg={3}>
            <CalendarEventForm />
          </Col>
        </Row>
      );
    } else {
      return <h4>loading calendar...</h4>;
    }
  };

  return (
    <div className="Calendar">
      <Container>
        <ContentWrapper>{render()}</ContentWrapper>
      </Container>
    </div>
  );
};

export default Calendar;
