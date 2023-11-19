import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { Calendar as ReactBigCalendar, dayjsLocalizer } from 'react-big-calendar';
import { onSelectSlot, onSelectEvent, onSelectView } from 'client/store/appSlice';
import { rbcEventsSelector } from 'client/store/eventsSlice';
import styles from 'client/styles/RbcWrapper.module.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const RbcWrapper = ({ calendars, rbcSelection, view }) => {
  const dispatch = useDispatch();

  // app state

  const calendarIds = useSelector((state) => state.calendars.allIds);
  const events = useSelector(rbcEventsSelector);

  // RBC setup
  dayjs.extend(timezone);
  const localizer = dayjsLocalizer(dayjs);

  // derived states
  const visibleCalendarIds = calendarIds.filter((id) => calendars[id].visibility === true);
  const visibleEvents = events.filter((event) => visibleCalendarIds.includes(event.calendar));

  // get styles for displaying calendar events
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
    const serializedEvent = {
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString()
    };

    dispatch(onSelectEvent(serializedEvent));
  };

  const handleSelectSlot = (slot) => {
    const serializedSlot = {
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      action: slot.action
    };

    dispatch(onSelectSlot(serializedSlot));
  };

  const handleView = (view) => {
    dispatch(onSelectView(view));
  };

  return (
    <div className={styles.container}>
      <ReactBigCalendar
        selectable
        localizer={localizer}
        events={visibleEvents}
        view={view}
        onView={(view) => handleView(view)}
        defaultDate={new Date(rbcSelection.slot?.start ?? rbcSelection.event.start)}
        scrollToTime={new Date(1970, 1, 1, 6)}
        onSelectEvent={(e) => handleSelectEvent(e)}
        onSelectSlot={(slot) => handleSelectSlot(slot)}
        startAccessor={(e) => e.start}
        endAccessor={(e) => e.end}
        eventPropGetter={(e) => eventStyleGetter(e)}
      />
    </div>
  );
};

export default RbcWrapper;
