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
  fetchUserData,
  currentSelection,
  eventsWithDateObjects,
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
    const { currentEvent } = this.props.currentSelection;

    // If event matches previous selection, do nothing
    if (Object.keys(currentEvent).length > 0 && e.id === currentEvent.id) return;

    this.props.onSelectEvent(e);
  };

  handleSelectSlot = (slot) => {
    const { currentSlot } = this.props.currentSelection;

    // If slot matches previous selection, do nothing
    const isSameSlotSelected = this.isSameSlot(currentSlot, slot);

    if (isSameSlotSelected && Object.keys(currentSlot).length > 0) return;

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
    currentSelection: currentSelection(state),
    events: eventsWithDateObjects(state)
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
