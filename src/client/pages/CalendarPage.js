import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import CalendarToggleMenu from '../components/CalendarToggleMenu';
import EventForm from '../components/EventForm';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  retrieveUserData,
  calendarSelectionWithSlotAndEvent,
  calendarEventsWithDateObjects,
  initializeCalendarView
} from '../store/userSlice';

import '../styles/CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isUserDataLoaded: false
    };
  }

  componentDidMount = () => {
    Promise.all([this.props.retrieveUserData(this.props.userId), this.props.initializeCalendarView()]);
  };

  componentDidUpdate = () => {
    const isUserDataLoaded =
      this.props.username &&
      this.props.calendars.some((calendar) => calendar.userDefault === true) &&
      this.props.calendarEventsWithDateObjects.length > 0;

    if (isUserDataLoaded && !this.state.isUserDataLoaded) {
      this.setState({ isUserDataLoaded: true });
    }
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
    let prevSlotStartDate = new Date(prevSlot.start);
    let prevSlotEndDate = new Date(prevSlot.end);

    let currentSlotStartDate = currentSlot.start;
    let currentSlotEndDate = currentSlot.end;

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
    let visibleCalendars = [];
    let visibleEvents = [];
    const isUserDataLoaded = this.state.isUserDataLoaded;

    if (isUserDataLoaded) {
      // returns array of calendar IDs
      visibleCalendars = this.props.calendars
        .filter((calendar) => calendar.visibility === true)
        .map((calendar) => calendar.id);

      visibleEvents = this.props.calendarEventsWithDateObjects.filter((event) =>
        visibleCalendars.includes(event.calendarId)
      );
    }

    if (isUserDataLoaded) {
      return (
        <div className="CalendarPage">
          <Container>
            <Row>
              <Col xs={12} md={2}>
                <CalendarToggleMenu />
              </Col>
              <Col xs={12} md={7}>
                <Calendar
                  selectable
                  localizer={localizer}
                  events={visibleEvents}
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
              <Col xs={12} md={3}>
                <EventForm />
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return <div>Loading page...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
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
  initializeCalendarView
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
