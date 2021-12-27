import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventForm from '../components/EventForm';
import { onSelectSlot, onSelectEvent, retrieveCalendarEvents } from '../store/userSlice';

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
                    onSelectEvent={(event) => this.props.onSelectEvent(event)}
                    onSelectSlot={(event) => this.props.onSelectSlot(event)}
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
    calendarEvents: state.user.calendarEvents
  };
};

const mapActionsToProps = {
  onSelectSlot,
  onSelectEvent,
  retrieveCalendarEvents
};

export default connect(mapStateToProps, mapActionsToProps)(CalendarPage);
