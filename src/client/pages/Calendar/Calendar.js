import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  fetchUserData,
  rbcEventsSelector,
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
  const shouldInitData = useRef(true);

  // Redux selectors
  const calendars = useSelector((state) => state.user.calendars);
  const events = useSelector(rbcEventsSelector);
  const currentSelection = useSelector(currentSelectionSelector);

  // Fetch initial user data
  useEffect(() => {
    if (shouldInitData.current) {
      const initData = [dispatch(fetchUserData()), dispatch(initCalendarUI())];
      Promise.all(initData);
      shouldInitData.current = false;
    }
  }, []);

  // Styles used for displaying calendar events
  const eventStyleGetter = (event) => {
    const calendar = calendars.filter((calendar) => calendar.id === event.calendar);

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

  const handleSelectEvent = (event) => {
    const { event: currentEvent } = currentSelection;

    // If event matches previous selection, do nothing
    const isNewEventSelected = !currentEvent.id || event.id !== currentEvent.id;

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
    if (isSameSlot(currentSlot, slot)) return;

    const serializedSlot = {
      ...slot,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      slots: slot.slots.map((slot) => slot.toISOString())
    };

    dispatch(onSelectSlot(serializedSlot));
  };

  // Comparisons are made using primitive values of Date objects i.e. date.getTime()
  const isSameSlot = (currentSlot, candidateSlot) => {
    if (Object.keys(currentSlot).length < 1 || Object.keys(candidateSlot).length < 1) return false;

    const isSame =
      candidateSlot.start.getTime() === currentSlot.start.getTime() &&
      candidateSlot.end.getTime() === currentSlot.end.getTime();

    if (isSame) return true;

    return false;
  };

  const handleView = (view) => {
    dispatch(onSelectView(view));
  };

  const render = () => {
    // check for calendar data
    const isCalendarLoaded = calendars.some((calendar) => calendar.userDefault === true) && currentSelection != null;

    if (isCalendarLoaded) {
      const visibleCalendars = calendars
        .filter((calendar) => calendar.visibility === true)
        .map((calendar) => calendar.id);

      const visibleEvents = events?.filter((event) => visibleCalendars.includes(event.calendar)) || [];

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
