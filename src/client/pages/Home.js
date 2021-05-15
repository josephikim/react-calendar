import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import EventDetail from '../components/EventDetail';
// import UserSettings from '../components/UserSettings'

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class Home extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      events: [
        {
          id: 0,
          title: 'All Day Event very long title',
          allDay: true,
          start: new Date(2021, 3, 0),
          end: new Date(2021, 3, 1),
        },
        {
          id: 1,
          title: 'Long Event',
          start: new Date(2021, 3, 7),
          end: new Date(2021, 3, 10),
        },

        {
          id: 2,
          title: 'DTS STARTS',
          start: new Date(2022, 2, 13, 0, 0, 0),
          end: new Date(2022, 2, 20, 0, 0, 0),
        },

        {
          id: 3,
          title: 'DTS ENDS',
          start: new Date(2021, 10, 6, 0, 0, 0),
          end: new Date(2021, 10, 13, 0, 0, 0),
        },

        {
          id: 4,
          title: 'Some Event',
          start: new Date(2021, 3, 9, 0, 0, 0),
          end: new Date(2021, 3, 10, 0, 0, 0),
        },
        {
          id: 5,
          title: 'Conference',
          start: new Date(2021, 3, 11),
          end: new Date(2021, 3, 13),
          desc: 'Big conference for important people',
        },
        {
          id: 6,
          title: 'Meeting',
          start: new Date(2021, 3, 12, 10, 30, 0, 0),
          end: new Date(2021, 3, 12, 12, 30, 0, 0),
          desc: 'Pre-meeting meeting, to prepare for the meeting',
        },
        {
          id: 7,
          title: 'Lunch',
          start: new Date(2021, 3, 12, 12, 0, 0, 0),
          end: new Date(2021, 3, 12, 13, 0, 0, 0),
          desc: 'Power lunch',
        },
        {
          id: 8,
          title: 'Meeting',
          start: new Date(2021, 3, 12, 14, 0, 0, 0),
          end: new Date(2021, 3, 12, 15, 0, 0, 0),
        },
        {
          id: 9,
          title: 'Happy Hour',
          start: new Date(2021, 3, 12, 17, 0, 0, 0),
          end: new Date(2021, 3, 12, 17, 30, 0, 0),
          desc: 'Most important meal of the day',
        },
        {
          id: 10,
          title: 'Dinner',
          start: new Date(2021, 3, 12, 20, 0, 0, 0),
          end: new Date(2021, 3, 12, 21, 0, 0, 0),
        },
        {
          id: 11,
          title: 'Planning Meeting with Paige',
          start: new Date(2021, 3, 13, 8, 0, 0),
          end: new Date(2021, 3, 13, 10, 30, 0),
        },
        {
          id: 11.1,
          title: 'Inconvenient Conference Call',
          start: new Date(2021, 3, 13, 9, 30, 0),
          end: new Date(2021, 3, 13, 12, 0, 0),
        },
        {
          id: 11.2,
          title: "Project Kickoff - Lou's Shoes",
          start: new Date(2021, 3, 13, 11, 30, 0),
          end: new Date(2021, 3, 13, 14, 0, 0),
        },
        {
          id: 11.3,
          title: 'Quote Follow-up - Tea by Tina',
          start: new Date(2021, 3, 13, 15, 30, 0),
          end: new Date(2021, 3, 13, 16, 0, 0),
        },
        {
          id: 12,
          title: 'Late Night Event',
          start: new Date(2021, 3, 17, 19, 30, 0),
          end: new Date(2021, 3, 18, 2, 0, 0),
        },
        {
          id: 12.5,
          title: 'Late Same Night Event',
          start: new Date(2021, 3, 17, 19, 30, 0),
          end: new Date(2021, 3, 17, 23, 30, 0),
        },
        {
          id: 13,
          title: 'Multi-day Event',
          start: new Date(2021, 3, 20, 19, 30, 0),
          end: new Date(2021, 3, 22, 2, 0, 0),
        },
        {
          id: 14,
          title: 'Today',
          start: new Date(new Date().setHours(new Date().getHours() - 3)),
          end: new Date(new Date().setHours(new Date().getHours() + 3)),
        },
        {
          id: 15,
          title: 'Point in Time Event',
          start: new Date(),
          end: new Date(),
        },
        {
          id: 16,
          title: 'Video Record',
          start: new Date(2021, 3, 14, 15, 30, 0),
          end: new Date(2021, 3, 14, 19, 0, 0),
        },
        {
          id: 17,
          title: 'Dutch Song Producing',
          start: new Date(2021, 3, 14, 16, 30, 0),
          end: new Date(2021, 3, 14, 20, 0, 0),
        },
        {
          id: 18,
          title: 'Itaewon Halloween Meeting',
          start: new Date(2021, 3, 14, 16, 30, 0),
          end: new Date(2021, 3, 14, 17, 30, 0),
        },
        {
          id: 19,
          title: 'Online Coding Test',
          start: new Date(2021, 3, 14, 17, 30, 0),
          end: new Date(2021, 3, 14, 20, 30, 0),
        },
        {
          id: 20,
          title: 'An overlapped Event',
          start: new Date(2021, 3, 14, 17, 0, 0),
          end: new Date(2021, 3, 14, 18, 30, 0),
        },
        {
          id: 21,
          title: 'Phone Interview',
          start: new Date(2021, 3, 14, 17, 0, 0),
          end: new Date(2021, 3, 14, 18, 30, 0),
        },
        {
          id: 22,
          title: 'Cooking Class',
          start: new Date(2021, 3, 14, 17, 30, 0),
          end: new Date(2021, 3, 14, 19, 0, 0),
        },
        {
          id: 23,
          title: 'Go to the gym',
          start: new Date(2021, 3, 14, 18, 30, 0),
          end: new Date(2021, 3, 14, 20, 0, 0),
        },
      ]
    }
  }
  componentDidMount = () => {
    // this.initData()
  }

  // initData = () => {
  //   // const accessString = window.localStorage.getItem('JWT')
  //   axios
  //     // .get(`${process.env.API_URL}/events`, {
  //     //   headers: { Authorization: `JWT ${accessString}` },
  //     // })
  //     .get(`${process.env.API_URL}/events`)
  //     .then(res => {
  //       // change startdate and enddate to date objects
  //       res.data.forEach(function (arrayItem) {
  //         arrayItem.start = new Date(arrayItem.start)
  //         arrayItem.end = new Date(arrayItem.end)
  //       })
  //       this.setState({
  //         events: res.data
  //       })
  //     })
  // }

  // eventStyleGetter = event => {
  //     let calendar = event.calendar
  //     let backgroundColor = '#' + calendars[calendar.toUpperCase()].color
  //     let style = {
  //         backgroundColor: backgroundColor,
  //     }
  //     return {
  //         style: style,
  //     }
  // }

  render() {
    return (
      <div id="home">
        <Row>
          <Col xs={12} md={8} lg={8}>
            <Calendar
              selectable
              localizer={localizer}
              events={this.state.events}
              defaultView="month"
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={new Date()}
              onSelectEvent={event => this.openModifyEvent(event)}
              onSelectSlot={event => this.onSelectSlot(event)}
              endAccessor={({ end }) => new Date(end.getTime() + 1)}
            // eventPropGetter={this.eventStyleGetter}
            />
          </Col>
          <Col xs={12} md={4} lg={4}>
            <EventDetail />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    calendars: state.calendars
  };
};

export default connect(mapStateToProps)(Home);