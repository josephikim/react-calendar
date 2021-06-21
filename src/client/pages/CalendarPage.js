import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventDetail from '../components/EventDetail';
import { onSelectSlot, onSelectEvent, retrieveEvents } from '../actions/calendarActions';

import '../styles/CalendarPage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
    }
  }

  componentDidMount = () => {
    this.initData()
  }

  initData = () => {
    this.props.retrieveEvents();
  }

  onSelectSlot = (event) => {
    if (Object.keys(this.props.selectedSlot).length === 0 || this.props.selectedSlot === undefined) {
      this.props.onSelectSlot(event);
    } else {
      const selectedSlotStart = new Date(this.props.selectedSlot.start.toDateString());
      const selectedSlotEnd = new Date(this.props.selectedSlot.end.toDateString());

      const sameSlotSelected =
        event.start.valueOf() === selectedSlotStart.valueOf() &&
        event.end.valueOf() === selectedSlotEnd.valueOf();

      if (!sameSlotSelected) this.props.onSelectSlot(event);
    }
  }

  onSelectEvent = (event) => {
    const noneSelected = Object.keys(this.props.selectedEvent).length === 0
    if (noneSelected) {
      this.props.onSelectEvent(event);
    } else { // check event IDs
      const sameEventId = event._id === this.props.selectedEvent._id;
      if (!sameEventId) this.props.onSelectEvent(event);
    }
  }

  render() {
    return (
      <div id="calendar">
        <Container>
          <Row>
            <Col xs={12} md={8} lg={8}>
              <Calendar
                selectable
                localizer={localizer}
                events={this.props.events}
                defaultView="month"
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
              <EventDetail />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.calendar.events,
    selectedSlot: state.calendar.selectedSlot,
    selectedEvent: state.calendar.selectedEvent
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  retrieveEvents
}

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);