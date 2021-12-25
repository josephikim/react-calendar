import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventForm from '../components/EventForm';
import { onSelectSlot, onSelectEvent, retrieveCalendarEvents, calendarSlotSelectionUpdated } from '../store/userSlice';

import '../styles/CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args);

    const initialState = {
      events: [],
      calendars: []
    };

    this.state = initialState;
  }

  componentDidMount = () => {
    this.props.retrieveCalendarEvents(this.props.userId);
  };

  onSelectSlot = (event) => {
    const slotsMatch = this.isSameSlot(this.props.calendarSlotSelection, event);

    if (slotsMatch) return;

    this.props.onSelectSlot(event);
  };

  isSameSlot = (prevSlot, currentSlot) => {
    const prevSlotEmpty = Object.keys(prevSlot).length === 0;

    if (prevSlotEmpty) {
      return false;
    }

    let prevSlotStartDate = new Date(prevSlot.start);
    let prevSlotEndDate = new Date(prevSlot.end);

    let startDatesMatch = false;
    let endDatesMatch = false;

    // Single day slot selected in Month view. Compares date only.
    if (currentSlot.slots.length == 1) {
      prevSlotStartDate.setHours(0, 0, 0, 0);
      prevSlotEndDate.setHours(0, 0, 0, 0);
      currentSlot.start.setHours(0, 0, 0, 0);
      currentSlot.end.setHours(0, 0, 0, 0);
    }

    startDatesMatch = prevSlotStartDate.valueOf() == currentSlot.start.valueOf();
    endDatesMatch = prevSlotEndDate.valueOf() == currentSlot.end.valueOf();

    if (startDatesMatch && endDatesMatch) {
      return true;
    }
    return false;
  };

  onSelectEvent = (event) => {
    const eventsMatch = this.isSameEvent(this.props.calendarEventSelection, event);

    if (eventsMatch) return;

    this.props.onSelectEvent(event);
  };

  isSameEvent = (prevEvent, currentEvent) => {
    const prevEventEmpty = Object.keys(prevEvent).length === 0;

    if (prevEventEmpty) {
      return false;
    }

    const eventsMatch = prevEvent._id === currentEvent._id;

    if (eventsMatch) {
      return true;
    }
    return false;
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

  render() {
    const calendarsLoaded = this.props.calendars.length > 0;
    const calendarEventsLoaded = this.props.calendarEvents.length > 0;

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
                    events={this.props.calendarEvents}
                    defaultView="month"
                    defaultDate={new Date()}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    onSelectEvent={(event) => this.onSelectEvent(event)}
                    onSelectSlot={(event) => this.onSelectSlot(event)}
                    startAccessor={(event) => event.start}
                    endAccessor={(event) => event.end}
                    eventPropGetter={(event) => this.eventStyleGetter(event)}
                  />
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <EventForm
                    calendarSlotSelection={this.props.calendarSlotSelection}
                    calendarEventSelection={this.props.calendarEventSelection}
                    calendars={this.props.calendars}
                  />
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
    calendarEvents: state.user.calendarEvents,
    calendarSlotSelection: state.user.calendarSlotSelection,
    calendarEventSelection: state.user.calendarEventSelection
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  retrieveCalendarEvents
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
