import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

import { createEvent, updateEvent, deleteEvent } from '../actions/calendarActions';
import { validateFields } from '../validation.js';

import '../styles/EventDetail.css';
import 'react-day-picker/lib/style.css';

class EventDetail extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      formData: {
        title: '',
        desc: '',
        startDate: this.props.selectedSlot.start,
        endDate: this.props.selectedSlot.end,
      },
      validateTitleOnChange: false,
      titleError: '',
      submitCalled: false
    }
  }

  componentDidUpdate = (prevProps) => {
    // Update state based on props.selectedSlot
    if (this.props.selectedSlot &&
      Object.keys(this.props.selectedSlot).length > 0 &&
      prevProps.selectedSlot !== this.props.selectedSlot) {
      this.setState({
        ...this.state,
        formData: {
          title: '',
          desc: '',
          startDate: this.props.selectedSlot.start,
          endDate: this.props.selectedSlot.end
        },
        validateTitleOnChange: false,
        titleError: '',
      });
    }
    // Update state based on props.selectedEvent
    if (this.props.selectedEvent &&
      Object.keys(this.props.selectedEvent).length > 0 &&
      prevProps.selectedEvent !== this.props.selectedEvent) {
      this.setState({
        ...this.state,
        formData: {
          title: this.props.selectedEvent.title,
          desc: this.props.selectedEvent.desc,
          startDate: this.props.selectedEvent.startDate,
          endDate: this.props.selectedEvent.endDate
        },
        validateTitleOnChange: false,
        titleError: '',
      });
    }
  }

  handleBlur = event => {
    const { target: { name, value } } = event;
    if (
      this.state.validateTitleOnChange === false &&
      this.state.submitCalled === false
    ) {
      const newState = {
        ...this.state,
        formData: {
          ...this.state.formData,
          [name]: value
        },
        validateTitleOnChange: true,
        titleError: validateFields.validateTitle(value)
      }
      this.setState(newState);
    }
    return;
  }

  handleChange = event => {
    const { target: { name, value } } = event;
    const newState = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [name]: value
      }
    }
    if (name === 'title') {
      newState.titleError = this.state.validateTitleOnChange ? validateFields.validateTitle(value) : ''
    }
    this.setState(newState);
  }

  handleStartDayChange = day => {
    const newState = {
      startDate: day
    }
    // only update endDate when a later date is selected
    if (day > this.state.formData.endDate) {
      newState.endDate = day;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleEndDayChange = day => {
    const newState = {
      endDate: day
    }
    // only update startDate when an earlier date is selected
    if (day < this.state.formData.startDate) {
      newState.startDate = day;
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newState
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      title: this.state.formData.title,
      desc: this.state.formData.desc,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate
    }
    const titleError = validateFields.validateTitle(data.title);
    if (!titleError) {
      try {
        const newState = {
          ...this.state,
          validateTitleOnChange: false,
          titleError: '',
          submitCalled: false
        }
        this.props.createEvent(data).then(this.setState(newState));
      } catch (err) {
        this.setState({ error: err.response.data })
      }
    } else {
      const newState = {
        validateTitleOnChange: true,
        titleError
      }
      this.setState(newState);
    }
  }

  handleSave = (event) => {
    event.preventDefault();
    if (this.state.titleError) return;

    const data = {
      _id: this.props.selectedEvent._id,
      title: this.state.formData.title,
      desc: this.state.formData.desc,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate
    }
    const titleChanged = data.title !== this.props.selectedEvent.title;
    const descChanged = data.desc !== this.props.selectedEvent.desc;
    const startDateChanged = data.startDate !== this.props.selectedEvent.startDate;
    const endDateChanged = data.endDate !== this.props.selectedEvent.endDate;
    const formValuesChanged = titleChanged || descChanged || startDateChanged || endDateChanged;
    
    if (formValuesChanged) {
      try {
        const newState = {
          ...this.state,
          validateTitleOnChange: false,
          titleError: ''
        }
        this.props.updateEvent(data).then(this.setState(newState));
      } catch (err) {
        this.setState({ error: err.response.data })
      }
    } else {
      alert('Please make changes before saving')
    }
  }

  handleDelete = (event) => {
    event.preventDefault();
    if (!this.props.selectedEvent) return;
    const eventId = this.props.selectedEvent._id;
    try {
      this.props.deleteEvent(eventId);
    } catch (err) {
      this.setState({ error: err.response.data })
    }
  }

  render() {
    const titleFail = !!this.state.titleError;
    return (
      <div id="event-detail">
        <Container>
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
              className={`input ${titleFail ? "input--fail" : null} `}
              rows='1'
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={this.state.formData.title}
            >
              enter title
            </textarea>
            <div className="text-danger">
              <small>{this.state.titleError}</small>
            </div>

            <label htmlFor='desc'>Event Description</label>
            <textarea
              name='desc'
              className='input'
              rows='3'
              onChange={this.handleChange}
              value={this.state.formData.desc}
            >
              enter description
            </textarea>

            <label htmlFor='startDate'>Event Start</label>
            <DayPickerInput
              className='day-picker-input'
              formatDate={formatDate}
              parseDate={parseDate}
              value={`${formatDate(this.state.formData.startDate)}`}
              onDayChange={this.handleStartDayChange}
            />

            <label htmlFor='endDate'>Event End</label>
            <DayPickerInput
              className='day-picker-input'
              formatDate={formatDate}
              parseDate={parseDate}
              value={`${formatDate(this.state.formData.endDate)}`}
              onDayChange={this.handleEndDayChange}
            />

            <div className='submit'>
              <input
                type='submit'
                value='Add Event'
                name='add-event-btn'
                id='add-event-btn'
                className='button'
                onMouseDown={() => this.setState({ submitCalled: true })}
              />
              <input
                type='button'
                value='Save Changes'
                name='save-changes-btn'
                id='save-changes-btn'
                className='button'
                onClick={this.handleSave}
                
              />
              <input
                type='button'
                value='Delete Event'
                name='delete-event-btn'
                id='delete-event-btn'
                className='button'
                onClick={this.handleDelete}
              />
            </div>
          </form>
        </Container>
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

const mapActionsToProps = {
  createEvent,
  updateEvent,
  deleteEvent
}

export default connect(mapStateToProps, mapActionsToProps)(EventDetail);