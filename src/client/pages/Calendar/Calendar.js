import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar as ReactBigCalendar, momentLocalizer } from 'react-big-calendar';

import CalendarToggleMenu from './CalendarToggleMenu';
import CalendarEventForm from './CalendarEventForm';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  retrieveUserData,
  calendarSelectionWithSlotAndEvent,
  calendarEventsWithDateObjects,
  initCalendarUI
} from 'client/store/userSlice';

import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ContentWrapper from 'client/components/ContentWrapper';

const localizer = momentLocalizer(moment);

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

    this.initData = [this.props.retrieveUserData(), this.props.initCalendarUI()];

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

  handleSelectEvent = (event) => {
    const { calendarEvent } = this.props.calendarSelectionWithSlotAndEvent;

    // If event matches previous selection, do nothing
    if (Object.keys(calendarEvent).length > 0 && event.id === calendarEvent.id) return;

    this.props.onSelectEvent(event);
  };

  handleSelectSlot = (slot) => {
    const { calendarSlot } = this.props.calendarSelectionWithSlotAndEvent;

    // If slot matches previous selection, do nothing
    const isSameSlotSelected = this.isSameSlot(calendarSlot, slot);

    if (Object.keys(calendarSlot).length > 0 && isSameSlotSelected) return;

    this.props.onSelectSlot(slot);
  };

  isSameSlot = (prevSlot, currentSlot) => {
    const prevSlotStartDate = new Date(prevSlot.start);
    const prevSlotEndDate = new Date(prevSlot.end);

    const currentSlotStartDate = currentSlot.start;
    const currentSlotEndDate = currentSlot.end;

    let isSameSlotStart = false;
    let isSameSlotEnd = false;

    // For month view with single-day slot selected, compare dates only
    if (currentSlot.slots.length === 1) {
      prevSlotStartDate.setHours(0, 0, 0, 0);
      prevSlotEndDate.setHours(0, 0, 0, 0);
      currentSlotStartDate.setHours(0, 0, 0, 0);
      currentSlotEndDate.setHours(0, 0, 0, 0);
    }

    isSameSlotStart = prevSlotStartDate.valueOf() === currentSlotStartDate.valueOf();
    isSameSlotEnd = prevSlotEndDate.valueOf() === currentSlotEndDate.valueOf();

    if (isSameSlotStart && isSameSlotEnd) {
      return true;
    }
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

    const events = this.props.calendarEventsWithDateObjects.filter((event) =>
      visibleCalendars.includes(event.calendarId)
    );

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
                    onSelectEvent={(event) => this.handleSelectEvent(event)}
                    onSelectSlot={(slot) => this.handleSelectSlot(slot)}
                    startAccessor={(event) => event.start}
                    endAccessor={(event) => event.end}
                    eventPropGetter={(event) => this.eventStyleGetter(event)}
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
    calendarSelectionWithSlotAndEvent: calendarSelectionWithSlotAndEvent(state),
    calendarEventsWithDateObjects: calendarEventsWithDateObjects(state)
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  retrieveUserData,
  initCalendarUI
};

export default connect(mapStateToProps, mapActionsToProps)(Calendar);
