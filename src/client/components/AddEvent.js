/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from 'axios'
import { DateRangePicker } from 'react-dates'
// import SourceSelectMenu from '../SourceSelectMenu'

const propTypes = {
  start: PropTypes.object,
  end: PropTypes.object,
  title: PropTypes.string,
  desc: PropTypes.string,
  source: PropTypes.string,
  onEventAdd: PropTypes.func,
}

class AddEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formValues: {
        title: '',
        desc: '',
        start: this.props.start,
        end: this.props.start,
        allDay: true,
        region: '',
        platform: ''
      }
    }
  }

  handleChange = event => {
    event.preventDefault()
    let formValues = this.state.formValues
    formValues[event.target.name] = event.target.value
    this.setState({ formValues })
  }

  handleSubmit = event => {
    let renderAdd = this.props.onEventAdd
    event.preventDefault()
    // Check for required data
    if (
      !this.state.formValues.title ||
      !this.state.formValues.start ||
      !this.state.formValues.end ||
      !this.state.formValues.source ||
      !this.state.formValues.allDay
    ) return
    // Prepare data
    let data = {
      title: this.state.formValues.title.trim(),
      desc: this.state.formValues.desc.trim(),
      start: this.state.formValues.start,
      end: this.state.formValues.end,
      source: this.state.formValues.source,
      allDay: this.state.formValues.allDay,
      region: this.state.formValues.region.trim(),
      platform: this.state.formValues.platform.trim()
    }
    data.source = data.source.toUpperCase()

    // Make API call to create event
    const accessString = window.localStorage.getItem('JWT')
    let config = {
      headers: {
        'Authorization': `JWT ${accessString}`
      }
    }
    axios
      .post(`${process.env.API_URL}/event`, data, config)
      .then(res => {
        // Update local state
        this.setState({
          lastAddedEvent: res.data._id,
        })
        // Rerender main calendar
        renderAdd(res.data)
      })
  }

  render() {
    return (
      <div id='add-event'>
        <form
          action='action_url'
          method='post'
          id='add-event-form'
          name='add-event-form'
          className='validate'
          onSubmit={this.handleSubmit}
          target='_blank'
          noValidate
        >
          <div id='add-event_scroll'>
            <h2>Add Event</h2>
            <div className='event-title-wrap'>
              <label htmlFor='title'>Event Title (required)</label>
              <textarea
                name='title'
                rows='4'
                onChange={this.handleChange}
                //  value={this.state.formValues.title}
                value='title-test'
              >
                enter title
             </textarea>
            </div>
            <div className='event-desc-wrap'>
              <label htmlFor='desc'>Event Description</label>
              <textarea
                name='desc'
                rows='4'
                onChange={this.handleChange}
                //  value={this.state.formValues.desc}
                value='title-desc'
              >
                enter description
             </textarea>
            </div>
            <div className='event-date-picker-wrap'>
              <label>Event Date (required)</label>
              <DateRangePicker
                startDate={moment(this.state.formValues.start)} // momentPropTypes.momentObj or null,
                startDateId='datepicker-start-date' // PropTypes.string.isRequired,
                endDate={moment(this.state.formValues.end)} // momentPropTypes.momentObj or null,
                endDateId='datepicker-end-date' // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => {
                  if (endDate === null) endDate = startDate;
                  let formValues = { ...this.state.formValues }
                  formValues.start = startDate.toDate()
                  formValues.end = endDate.toDate()
                  this.setState({ formValues })
                }} // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              />
            </div>
            <div className='event-source-wrap'>
              <label htmlFor='source'>Event Source</label>
              {/* <SourceSelectMenu disabled onChange={this.handleChange} value={this.state.formValues.source} /> */}
            </div>
            <div className='event-platform-wrap'>
              <label htmlFor='platform'>Platform</label>
              <input
                type='text'
                name='platform'
                onChange={this.handleChange}
                value={this.state.formValues.platform}
              />
            </div>
            <div className='event-region-wrap'>
              <label htmlFor='region'>Region</label>
              <input
                type='text'
                name='region'
                onChange={this.handleChange}
                value={this.state.formValues.region}
              />
            </div>
            <div className='submit'>
              <input
                type='submit'
                value='Add Event'
                name='add-event-btn'
                id='add-event-btn'
                className='button'
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

AddEvent.propTypes = propTypes

export default AddEvent
