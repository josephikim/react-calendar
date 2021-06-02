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
      eventsLoaded: false,
    }
  }
  
  componentDidMount = () => {
    this.initData()
  }

  componentDidUpdate = () => {
    if (!this.state.eventsLoaded && this.props.events.length > 0) {
      this.setState({
        eventsLoaded: true
      });
    }
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
    if (Object.keys(this.props.selectedEvent).length === 0 || this.props.selectedEvent === undefined) {
      this.props.onSelectEvent(event);
    } else {
      const selectedEventStartDate = new Date(this.props.selectedEvent.startDate.toDateString());
      const selectedEventEndDate = new Date(this.props.selectedEvent.endDate.toDateString());
      
      const sameEventSelected =
        event.startDate.valueOf() === selectedEventStartDate.valueOf() && 
        event.endDate.valueOf() === selectedEventEndDate.valueOf();

      if (!sameEventSelected) this.props.onSelectEvent(event);
    }
  }
  
  render() {
    return (
      this.state.eventsLoaded &&
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
              // eventPropGetter={this.eventStyleGetter}
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
    login: state.config.login,
    calendars: state.config.calendars,
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