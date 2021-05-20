import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

import { createEvent } from '../actions/calendarActions';

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

  handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      title: this.state.title,
      desc: this.state.desc,
      startDate: this.state.startDate,
      endDate: this.state.endDate     
    }

    // if (!data.title || !data.startDate || !data.endDate) {
    //   // alert user and return
    // }
    alert('creatEvent hit')
    createEvent(data);
  }

  render() {
    return (
      <div id="event-detail">
        <Row>
          <form
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