import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";

import EventForm from "../components/EventForm";
import {
  onSelectSlot,
  onSelectEvent,
  retrieveUserData,
} from "../actions/userActions";

import "../styles/CalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

class CalendarPage extends Component {
  constructor(...args) {
    super(...args);
  }

  componentDidMount = () => {
    this.props.retrieveUserData();
  };

  onSelectSlot = (event) => {
    const slotsMatch = this.isSameSlot(this.props.selectedSlot, event);

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

    startDatesMatch =
      prevSlotStartDate.valueOf() == currentSlot.start.valueOf();
    endDatesMatch = prevSlotEndDate.valueOf() == currentSlot.end.valueOf();

    if (startDatesMatch && endDatesMatch) {
      return true;
    }
    return false;
  };

  onSelectEvent = (event) => {
    const eventsMatch = this.isSameEvent(this.props.selectedEvent, event);

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

  render() {
    const eventsLoaded = this.props.events.length > 0;
    const calendarsLoaded = this.props.calendars.length > 0;
    return (
      <div className="CalendarPage">
        {eventsLoaded && calendarsLoaded && (
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
                  onSelectEvent={(event) => this.onSelectEvent(event)}
                  onSelectSlot={(event) => this.onSelectSlot(event)}
                  selected={this.props.selectedEvent}
                  startAccessor={(event) => event.start}
                  endAccessor={(event) => event.end}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <EventForm />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.user.events,
    selectedSlot: state.user.selectedSlot,
    selectedEvent: state.user.selectedEvent,
    calendars: state.user.calendars,
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  retrieveUserData,
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
