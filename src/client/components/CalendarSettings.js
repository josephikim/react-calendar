import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux';
import axios from 'axios'

// Components
import EventDetail from '../components/EventDetail'
import CalendarSettings from '../components/CalendarSettings'
import UserSettings from '../components/UserSettings'

import sources from '../db/sources.json'

class CalendarSettings extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            events: []
        }
    }
    componentDidMount = () => {
        this.initData()
    }
    render () {
        return (
            <div id="calendar-settings">
                <Row className="header align-items-center">
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <CalendarSettings />
                        <h2>React Calendar App</h2>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <UserSettings />
                        <a href="#" id="user-link">
                            <i className="fa fa-user-circle fa-2x" />
                        </a>
                    </Col>
                </Row>

                <Row className="main align-items-center"> 
                    <Col xs={12} sm={12} md={8} lg={8}>
                        <Row>
                            <Calendar
                                selectable
                                localizer={localizer}
                                events={this.state.events}
                                defaultView="month"
                                scrollToTime={new Date(1970, 1, 1, 6)}
                                defaultDate={new Date()}
                                onSelectEvent={event => this.openModifyEvent(event)}
                                onSelectSlot={event => this.openAddEvent(event)}
                                endAccessor={({ end }) => new Date(end.getTime() + 1)}
                                eventPropGetter={this.eventStyleGetter}
                            />
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <Row>
                            <EventDetail />
                        </Row>
                    </Col>
                </Row>

                <Row className="footer align-items-center">
                    <Col xs={12}>
                        <a
                            href="https://github.com/josephikim/react-calendar"
                            target="_blank"
                        >
                            Github Repo
                </a>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CalendarSettings;