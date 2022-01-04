import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import _ from 'lodash';

import EventForm from '../components/EventForm';
import {
  onSelectSlot,
  onSelectEvent,
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
      isUserCalendarLoaded: false
    };
  }

  componentDidMount = () => {
    this.props.initializeCalendarData(this.props.userId);
  };

  componentDidUpdate = () => {
    const isUserCalendarLoaded = this.props.calendars.some((calendar) => calendar.userDefault === true);

    if (isUserCalendarLoaded && this.state.isUserCalendarLoaded === false) {
      this.setState({ isUserCalendarLoaded: true });
    }
  };

  eventStyleGetter = (event) => {
    const calendar = this.props.calendars.filter((calendar) => calendar._id === event.calendarId);

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
    // check if event matches previous selection
    const { calendarEventSelection } = this.props.calendarSelectionWithSlotAndEvent;

    const isSameEventSelected = calendarEventSelection._id === event._id;

    if (isSameEventSelected) return;

    this.props.onSelectEvent(event);
  };

  handleSelectSlot = (slot) => {
    // check if slot matches previous selection
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
    if (this.state.isUserCalendarLoaded) {
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
  initializeCalendarData
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
