import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventDetail from '../components/EventDetail';
import { onSelectSlot, onSelectEvent, retrieveEvents } from '../actions/calendarActions';

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
      const selectedSlotStartDate = new Date(this.props.selectedSlot.start.toDateString());
      const selectedSlotEndDate = new Date(this.props.selectedSlot.end.toDateString());

      const sameSlotSelected = 
        event.start.valueOf() === selectedSlotStartDate.valueOf() && 
        event.end.valueOf() === selectedSlotEndDate.valueOf();

      if (!sameSlotSelected) this.props.onSelectSlot(event);
    }
  }

  onSelectEvent = (event) => {
    const noneSelected = Object.keys(this.props.selectedEvent).length === 0
    if(noneSelected) {
      this.props.onSelectEvent(event);
    } else { // check for same dates only, not times
      const eventStartDate = new Date(event.startDate.toDateString());
      const eventEndDate = new Date(event.endDate.toDateString());
      const selectedEventStartDate = new Date(this.props.selectedEvent.startDate.toDateString());
      const selectedEventEndDate = new Date(this.props.selectedEvent.endDate.toDateString());   
      const sameEventSelected =
        eventStartDate.valueOf() === selectedEventStartDate.valueOf() && 
        eventEndDate.valueOf() === selectedEventEndDate.valueOf();
      if (!sameEventSelected) this.props.onSelectEvent(event);
    }
  }
  
  render() {
    return (
      <div id="calendar">
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
              startAccessor={event => event.startDate}
              endAccessor={event => event.endDate}
            />
          </Col>
          <Col xs={12} md={4} lg={4}>
            <EventDetail/>
          </Col>
        </Row>
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