import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import _ from 'lodash';

import CalendarToggleMenu from '../components/CalendarToggleMenu';
import EventForm from '../components/EventForm';
import {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  initializeCalendarData,
  calendarSelectionWithSlotAndEvent,
  calendarEventsWithDateObjects
} from '../store/userSlice';

import '../styles/CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isUserCalendarLoaded: false,
      isInitialSlotLoaded: false
    };
  }

  componentDidMount = () => {
    this.props.initializeCalendarData(this.props.userId);
  };

  componentDidUpdate = () => {
    const isUserCalendarLoaded = this.props.calendars.some((calendar) => calendar.userDefault === true);

    const isInitialSlotLoaded = !!this.props.calendarSelectionWithSlotAndEvent;

    if (isUserCalendarLoaded && this.state.isUserCalendarLoaded === false) {
      this.setState({ isUserCalendarLoaded: true });
    }

    if (isInitialSlotLoaded && this.state.isInitialSlotLoaded === false) {
      this.setState({ isInitialSlotLoaded: true });
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
    const { calendarEventSelection } = this.props.calendarSelectionWithSlotAndEvent;

    // check if event matches previous selection
    if (Object.keys(calendarEventSelection).length > 0 && event.id === calendarEventSelection.id) return;

    this.props.onSelectEvent(event);
  };

  handleSelectSlot = (slot) => {
    const { calendarSlotSelection } = this.props.calendarSelectionWithSlotAndEvent;

    // check if slot matches previous selection
    const isSameSlotSelected = this.isSameSlot(calendarSlotSelection, slot);

    if (Object.keys(calendarSlotSelection).length > 0 && isSameSlotSelected) return;

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
    const isInitialDataLoaded = this.state.isUserCalendarLoaded && this.state.isInitialSlotLoaded;
    const visibleCalendars = this.props.calendars
      .filter((calendar) => calendar.visibility === true)
      .map((calendar) => calendar.id); // returns array of calendar IDs
    const visibleEvents = this.props.calendarEventsWithDateObjects.filter((event) =>
      visibleCalendars.includes(event.calendarId)
    );

    if (isInitialDataLoaded) {
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
      return <div>Loading...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.userId,
    calendars: state.user.calendars,
    calendarSelectionWithSlotAndEvent: calendarSelectionWithSlotAndEvent(state),
    calendarEventsWithDateObjects: calendarEventsWithDateObjects(state)
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  onSelectView,
  initializeCalendarData
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
