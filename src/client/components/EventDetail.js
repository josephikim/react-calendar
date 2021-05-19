import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

// import moment from 'moment'
// import DateRangePicker from 'react-bootstrap-daterangepicker';

import '../styles/EventDetail.css';
import 'react-day-picker/lib/style.css';

class EventDetail extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      title: 'test-title',
      desc: 'test-description',
      startDate: new Date(),
      endDate: new Date()
    }
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.selectedSlot !== this.props.selectedSlot) {
      this.setState({
        title: '',
        desc: '',
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end
      })
    }
    if(prevProps.selectedEvent !== this.props.selectedEvent) {
      this.setState({
        title: this.props.selectedEvent.title,
        desc: this.props.selectedEvent.desc,
        startDate: this.props.selectedEvent.start,
        endDate: this.props.selectedEvent.end
      })
    }
  }

  handleChange = event => {
    const { target: { name, value } } = event;
    this.setState({ [name]: value });
  }

  // openAddEvent = event => {
  //   let momentNow = moment(new Date()) // today's date
  //   let momentStart = moment(event.start)
  //   let momentEnd = moment(event.end)

  //   if (
  //     !momentStart.isBefore(momentNow, 'day') &&
  //     !momentEnd.isBefore(momentNow, 'day') &&
  //     !momentEnd.isBefore(momentStart, 'day')
  //   ) {
  //     this.setState({
  //       addIsOpen: true,
  //       modifyIsOpen: false,
  //       start: event.start,
  //         end: event.end,
  //         title: '',
  //         desc: ''
  //     })
  //   } else {
  //     this.setState({
  //       addIsOpen: true,
  //       modifyIsOpen: false,
  //       start: new Date(),
  //         end: new Date(),
  //         title: '',
  //         desc: ''
  //     })
  //   }
  // }

  // openModifyEvent = event => {
  //   if (event._id) {
  //     this.setState({
  //       addIsOpen: false,
  //       modifyIsOpen: true,
  //       id: event._id,
  //         title: event.title,
  //         desc: event.desc,
  //         start: event.start,
  //         end: event.end,
  //         allDay: event.allDay
  //     })
  //   }
  // }

  render() {
    return (
      <div id="event-detail">
        <Row>
          <form
            action='action_url'
            method='post'
            id='event-detail-form'
            name='event-detail-form'
            className='validate'
            onSubmit={this.handleSubmit}
            target='_blank'
            noValidate
          >
            <label htmlFor='title'>Event Title (required)</label>
            <textarea
              name='title'
              rows='1'
              onChange={this.handleChange}
              value={this.state.title}
            >
              enter title
            </textarea>
            <label htmlFor='desc'>Event Description</label>
            <textarea
              name='desc'
              rows='3'
              onChange={this.handleChange}
              value={this.state.desc}
            >
              enter description
            </textarea>
            <label htmlFor='startDate'>Event Start</label>
            <DayPickerInput
              formatDate={formatDate}
              parseDate={parseDate}
              placeholder={`${formatDate(this.state.startDate)}`}
            />
            <label htmlFor='endDate'>Event End</label>
            <DayPickerInput
              formatDate={formatDate}
              parseDate={parseDate}
              placeholder={`${formatDate(this.state.endDate)}`}
            />
            <div className='submit'>
              <input
                type='submit'
                value='Add Event'
                name='add-event-btn'
                id='add-event-btn'
                className='button'
              />
            </div>
          </form>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedSlot: state.calendar.selectedSlot,
    selectedEvent: state.calendar.selectedEvent
  };
};

export default connect(mapStateToProps)(EventDetail);