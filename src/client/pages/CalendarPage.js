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
    // Set store's selectedSlot to current date
    const dateStr = new Date().toISOString();

    let initialSlot = {
      action: 'click',
      start: dateStr,
      end: dateStr,
      slots: [
        dateStr
      ]
    }

    this.props.onSelectSlot(initialSlot);
    this.props.retrieveEvents();
  }

  onSelectSlot = (event) => {
    // Convert date objects to ISO strings
    let payload = event;

    if (Object.keys(this.props.selectedSlot).length === 0 || this.props.selectedSlot === undefined) { // If previous slot is empty
      payload.start = payload.start.toISOString();
      payload.end = payload.end.toISOString();
      this.props.onSelectSlot(payload);
    } else {
      // Check if current slot and previous slot are the same
      const selectedSlotStartDate = new Date(this.props.selectedSlot.start);
      const selectedSlotEndDate = new Date(this.props.selectedSlot.end);
      const selectedSlotUnchanged =
        payload.start.valueOf() == selectedSlotStartDate.valueOf() &&
        payload.end.valueOf() == selectedSlotEndDate.valueOf();

      if (selectedSlotUnchanged) return;

      payload.start = payload.start.toISOString();
      payload.end = payload.end.toISOString();
      this.props.onSelectSlot(payload);
    }
  }

  onSelectEvent = (event) => {
    const noneSelected = Object.keys(this.props.selectedEvent).length === 0;
    if (noneSelected) {
      this.props.onSelectEvent(event);
    } else { // check event IDs
      const sameEventId = event._id === this.props.selectedEvent._id;
      if (!sameEventId) this.props.onSelectEvent(event);
    }
  }

  render() {
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
                selected={this.props.selectedEvent}
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