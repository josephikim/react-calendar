import React, { Component } from 'react';
import dayjs from 'dayjs';
import { Calendar as ReactBigCalendar, dayjsLocalizer } from 'react-big-calendar';
import timezone from 'dayjs/plugin/timezone';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  fetchUserData,
  currentSelectionSelector,
  eventsWithDateObjectsSelector,
  initCalendarUI
} from 'client/store/userSlice';
import ContentWrapper from 'client/components/ContentWrapper';
import CalendarToggleMenu from './CalendarToggleMenu';
import CalendarEventForm from './CalendarEventForm';
import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

class Calendar extends Component {
  constructor(...args) {
    super(...args);
  }

  componentDidMount = () => {
    // Prevent duplicate initData calls due to double mounting in strict mode
    if (this.initData) {
      // already mounted previously
      return;
    }

    this.initData = [this.props.fetchUserData(), this.props.initCalendarUI()];

    Promise.all(this.initData);
  };

  eventStyleGetter = (event) => {
    const calendar = this.props.calendars.filter((calendar) => calendar.id === event.calendarId);

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

  handleSelectEvent = (e) => {
    const { event: currentEvent } = this.props.currentSelection;

    // If event matches previous selection, do nothing
    if (Object.keys(currentEvent).length > 0 && e.id === currentEvent.id) return;

    this.props.onSelectEvent(e);
  };

  handleSelectSlot = (slot) => {
    const { slot: currentSlot } = this.props.currentSelection;

    // If selected slot matches current slot, do nothing
    if (this.isSameSlot(currentSlot, slot)) return;

    const isMonthView = this.props.viewSelection === 'month';

    // For month view, set new slot of length 1 hour starting at noon
    if (isMonthView) {
      slot.start.setHours(12);
      slot.end.setHours(13);
    }

    const serializedSlot = {
      ...slot,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      slots: slot.slots.map((slot) => slot.toISOString())
    };

    // debugger;
    this.props.onSelectSlot(serializedSlot);
  };

  // Comparisons are done using Date objects' primitive values ie Date.valueOf()
  isSameSlot = (currentSlot, candidateSlot) => {
    if (Object.keys(currentSlot).length < 1 || Object.keys(candidateSlot).length < 1) return false;

    const currentSlotStartValue = currentSlot.start.valueOf();
    const currentSlotEndValue = currentSlot.end.valueOf();
    const candidateSlotStartValue = candidateSlot.start.valueOf();
    const candidateSlotEndValue = candidateSlot.end.valueOf();

    const isSame = candidateSlotStartValue <= currentSlotStartValue && candidateSlotEndValue >= currentSlotEndValue;

    // debugger;
    if (isSame) return true;

    return false;
  };

  handleView = (view) => {
    this.props.onSelectView(view);
  };

  render() {
    // returns array of calendar IDs
    const isDefaultCalendarLoaded = this.props.calendars.some((calendar) => calendar.userDefault === true);

    const visibleCalendars = this.props.calendars
      .filter((calendar) => calendar.visibility === true)
      .map((calendar) => calendar.id);

    const events = this.props.events.filter((event) => visibleCalendars.includes(event.calendarId));

    return (
      <div className="Calendar">
        <Container>
          <ContentWrapper>
            {isDefaultCalendarLoaded ? (
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
                    onView={(view) => this.handleView(view)}
                    defaultDate={new Date()}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    onSelectEvent={(e) => this.handleSelectEvent(e)}
                    onSelectSlot={(slot) => this.handleSelectSlot(slot)}
                    startAccessor={(e) => e.start}
                    endAccessor={(e) => e.end}
                    eventPropGetter={(e) => this.eventStyleGetter(e)}
                  />
                </Col>
                <Col xs={12} lg={3}>
                  <CalendarEventForm />
                </Col>
              </Row>
            ) : (
              <div>loading calendar...</div>
            )}
          </ContentWrapper>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    calendars: state.user.calendars,
    viewSelection: state.user.viewSelection,
    currentSelection: currentSelectionSelector(state),
    events: eventsWithDateObjectsSelector(state)
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  fetchUserData,
  initCalendarUI
};

export default connect(mapStateToProps, mapActionsToProps)(Calendar);
