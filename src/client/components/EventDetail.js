import React, { Component } from 'react'
import { Row } from 'react-bootstrap'

// import moment from 'moment'
// import DateRangePicker from 'react-bootstrap-daterangepicker';

import '../styles/EventDetail.css';
class EventDetail extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      title: 'test-title',
      description: 'test-description',
      startDate: '',
      endDate: ''
    }
  }
  componentDidMount = () => {
    // this.initData()
  }

  handleChange = event => {
    event.preventDefault()
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
  //         description: ''
  //     })
  //   } else {
  //     this.setState({
  //       addIsOpen: true,
  //       modifyIsOpen: false,
  //       start: new Date(),
  //         end: new Date(),
  //         title: '',
  //         description: ''
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
  //         description: event.description,
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
            <label htmlFor='description'>Event Description</label>
            <textarea
              name='description'
              rows='3'
              onChange={this.handleChange}
              value={this.state.description}
            >
              enter descriptionription
            </textarea>
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

export default EventDetail