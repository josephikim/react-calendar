import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  fetchUserData,
  currentSelectionSelector,
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
  const calendars = useSelector((state) => state.user.calendars);
  const viewSelection = useSelector((state) => state.user.viewSelection);
  const events = useSelector((state) => state.user.events);
  const currentSelection = useSelector(currentSelectionSelector);

  // Fetch initial user data
  useEffect(() => {
    const initData = [dispatch(fetchUserData()), dispatch(initCalendarUI())];

    Promise.all(initData);
  }, []);

  // Styles used for displaying calendar events
  const eventStyleGetter = (event) => {
    const calendar = calendars.filter((calendar) => calendar.id === event.calendarId);

    if (calendar.length < 1) return;

    // returns HEX code
    const getCalendarColor = () => {
      return calendar[0].color;
    };

    const style = {
      backgroundColor: getCalendarColor()
    };

    return {
      style: style
    };
  };

  const handleSelectEvent = (e) => {
    const { event: currentEvent } = currentSelection;

    // If event matches previous selection, do nothing
    const isNewEventSelected = !currentEvent.id || e.id !== currentEvent.id;

    if (isNewEventSelected) {
      dispatch(onSelectEvent(e));
    }
  };

  const handleSelectSlot = (slot) => {
    const { slot: currentSlot } = currentSelection;

    // For month view, set new slot to length of 1 hour starting at noon
    if (viewSelection === 'month') {
      slot.start.setHours(12);
      slot.end.setHours(13);
    }

    // If selected slot matches current slot, do nothing
    if (isSameSlot(currentSlot, slot)) return;

    const serializedSlot = {
      ...slot,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      slots: slot.slots.map((slot) => slot.toISOString())
    };

    dispatch(onSelectSlot(serializedSlot));
  };

  // Comparisons are made using primitive values of Date objects ie Date.valueOf()
  const isSameSlot = (currentSlot, candidateSlot) => {
    if (Object.keys(currentSlot).length < 1 || Object.keys(candidateSlot).length < 1) return false;

    const isSame =
      candidateSlot.start.valueOf() === currentSlot.start.valueOf() &&
      candidateSlot.end.valueOf() === currentSlot.end.valueOf();

    if (isSame) return true;

    return false;
  };

  const handleView = (view) => {
    dispatch(onSelectView(view));
  };

  const render = () => {
    // check for user calendar
    const isDefaultCalendarLoaded = calendars.some((calendar) => calendar.userDefault === true);

    if (isDefaultCalendarLoaded) {
      const visibleCalendars = calendars
        .filter((calendar) => calendar.visibility === true)
        .map((calendar) => calendar.id);

      const visibleEvents = events.filter((event) => visibleCalendars.includes(event.calendarId)) || [];

      return (
        <Row>
          <Col xs={12} lg={2}>
            <CalendarToggleMenu />
          </Col>
          <Col xs={12} lg={7}>
            <ReactBigCalendar
              selectable
              localizer={localizer}
              events={visibleEvents}
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
      return <div>loading calendar...</div>;
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
