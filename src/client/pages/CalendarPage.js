import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventForm from '../components/EventForm';
import {
  onSelectSlot,
  onSelectEvent,
  retrieveCalendarEvents,
  calendarSelectionWithSlotAndEvent,
  calendarEventsWithDateObjects
} from '../store/userSlice';

import '../styles/CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args);
  }

  componentDidMount = () => {
    this.props.retrieveCalendarEvents(this.props.userId);
  };

  eventStyleGetter = (event) => {
    // returns HEX code
    const getCalendarColor = () => {
      const calendar = this.props.calendars.filter((calendar) => calendar._id === event.calendarId);
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
    // check if same event selected
    const { calendarEventSelection } = this.props.calendarSelectionWithSlotAndEvent;
    const isSameEventSelected = calendarEventSelection._id === event._id;

    if (isSameEventSelected) return;

    this.props.onSelectEvent(event);
  };

  handleSelectSlot = (slot) => {
    // check if same slot selected
    const { calendarSlotSelection } = this.props.calendarSelectionWithSlotAndEvent;
    const isSameSlotSelected = this.isSameSlot(calendarSlotSelection, slot);

    if (isSameSlotSelected) return;

    this.props.onSelectSlot(slot);
  };

  isSameSlot = (prevSlot, currentSlot) => {
    let prevSlotStartDate = new Date(prevSlot.start);
    let prevSlotEndDate = new Date(prevSlot.end);

    let currentSlotStartDate = currentSlot.start;
    let currentSlotEndDate = currentSlot.end;

    let isSameSlotStart = false;
    let isSameSlotEnd = false;

    // If month view - single day slot selected, compare dates only
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

  render() {
    const calendarsLoaded = this.props.calendars.length > 0;
    const calendarEventsLoaded = this.props.calendarEventsWithDateObjects.length > 0;

    if (calendarsLoaded) {
      if (calendarEventsLoaded) {
        return (
          <div className="CalendarPage">
            <Container>
              <Row>
                <Col xs={12} md={8} lg={8}>
                  <Calendar
                    selectable
                    localizer={localizer}
                    events={this.props.calendarEventsWithDateObjects}
                    defaultView="month"
                    defaultDate={new Date()}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    onSelectEvent={(event) => this.handleSelectEvent(event)}
                    onSelectSlot={(slot) => this.handleSelectSlot(slot)}
                    startAccessor={(event) => event.start}
                    endAccessor={(event) => event.end}
                    eventPropGetter={(event) => this.eventStyleGetter(event)}
                  />
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <EventForm />
                </Col>
              </Row>
            </Container>
          </div>
        );
      } else {
        return (
          <>
            <Container>
              <h4>No events found!</h4>
            </Container>
          </>
        );
      }
    } else {
      return (
        <>
          <Container>
            <h4>Loading...</h4>
          </Container>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.userId,
    calendars: state.user.calendars,
    calendarEventsWithDateObjects: calendarEventsWithDateObjects(state),
    calendarSelectionWithSlotAndEvent: calendarSelectionWithSlotAndEvent(state)
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  retrieveCalendarEvents
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
