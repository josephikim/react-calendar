import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventForm from '../components/EventForm';
import { onSelectSlot, onSelectEvent, retrieveEvents } from '../actions/userActions';

import '../styles/CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args)
  }

  componentDidMount = () => {
    // Initialize calendar events
    this.props.retrieveEvents();
  }

  onSelectSlot = (event) => {
    const slotsMatch = this.isSameSlot(this.props.selectedSlot, event)
    if (slotsMatch) return;

    this.props.onSelectSlot(event);
  }

  isSameSlot = (prevSlot, currentSlot) => {
    const parsed = JSON.parse(prevSlot);
    const prevSlotEmpty = 
      Object.keys(parsed).length == 0 || 
      Object.keys(parsed).length == undefined;

    if (prevSlotEmpty) {
      return false;
    }

    let prevSlotStartDate = new Date(parsed.start);
    let prevSlotEndDate = new Date(parsed.end);

    let startDatesMatch = false;
    let endDatesMatch = false

    if (currentSlot.slots.length == 1) {  // single day selected in Month view, check date only
      prevSlotStartDate.setHours(0,0,0,0);
      prevSlotEndDate.setHours(0,0,0,0);
      currentSlot.start.setHours(0,0,0,0);
      currentSlot.end.setHours(0,0,0,0);
    }

    startDatesMatch = prevSlotStartDate.valueOf() == currentSlot.start.valueOf();
    endDatesMatch = prevSlotEndDate.valueOf() == currentSlot.end.valueOf();

    if (startDatesMatch && endDatesMatch) {
      return true
    }
    return false
  }

  onSelectEvent = (event) => {
    const eventsMatch = this.isSameEvent(this.props.selectedEvent, event)
    if (eventsMatch) return;

    this.props.onSelectEvent(event);
  }

  isSameEvent = (prevEvent, currentEvent) => {
    const parsed = JSON.parse(prevEvent);
    const prevEventEmpty = 
      Object.keys(parsed).length == 0 || 
      Object.keys(parsed).length == undefined;

    if (prevEventEmpty) {
      return false;
    }

    const eventsMatch = parsed._id === currentEvent._id;

    if (eventsMatch) {
      return true
    }
    return false
  }

  render() {
    const selectedEvent = this.props.selectedEvent;
    return (
      <div className='CalendarPage'>
        <Container>
          <Row>
            <Col xs={12} md={8} lg={8}>
              <Calendar
                selectable
                localizer={localizer}
                events={this.props.events}
                defaultView='month'
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                onSelectEvent={event => this.onSelectEvent(event)}
                onSelectSlot={event => this.onSelectSlot(event)}
                selected={selectedEvent ? JSON.parse(selectedEvent) : {}}
                startAccessor={event => event.start}
                endAccessor={event => event.end}
              />
            </Col>
            <Col xs={12} md={4} lg={4}>
              <EventForm />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.user.events,
    selectedSlot: state.user.selectedSlot,
    selectedEvent: state.user.selectedEvent
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  retrieveEvents
}

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);