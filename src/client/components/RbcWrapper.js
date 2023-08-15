import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { Calendar as ReactBigCalendar, dayjsLocalizer } from 'react-big-calendar';
import { onSelectSlot, onSelectEvent, onSelectView } from 'client/store/appSlice';
import { rbcEventsSelector } from 'client/store/eventsSlice';
import styles from 'client/styles/RbcWrapper.module.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const RbcWrapper = ({ calendars, currentSelection }) => {
  const dispatch = useDispatch();

  // app state
  const calendarIds = useSelector((state) => state.calendars.allIds);
  const events = useSelector(rbcEventsSelector);
  const username = useSelector((state) => state.user.username);

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
    if (!isNewSlot(currentSlot, slot)) return;

    const serializedSlot = {
      ...slot,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      slots: slot.slots.map((slot) => slot.toISOString())
    };

    dispatch(onSelectSlot(serializedSlot));
  };

  // Returns true if candidate slot and current slot are unique.
  // Comparisons are made using primitive values of Date objects i.e. date.getTime()
  const isNewSlot = (currentSlot, candidateSlot) => {
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

  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default RbcWrapper;
