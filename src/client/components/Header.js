import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
// import { connect } from 'react-redux';
// import axios from 'axios'

class Header extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            events: []
        }
    }
    componentDidMount = () => {
        this.initData()
    }

    initData = () => {
        // const accessString = window.localStorage.getItem('JWT')
        // axios
        //     .get(`${process.env.API_URL}/events`, {
        //         headers: { Authorization: `JWT ${accessString}` },
        //     })
        //     .then(res => {
        //         // change startdate and enddate to date objects
        //         res.data.forEach(function (arrayItem) {
        //             arrayItem.start = new Date(arrayItem.start)
        //             arrayItem.end = new Date(arrayItem.end)
        //         })
        //         this.setState({
        //             events: res.data
        //         })
        //     })
    }

    render() {
        return (
            <div id="header">
                <Row className="align-items-center">
                    <Col xs={6} sm={6} md={6} lg={6}>
                        {/* <CalendarSettings /> */}
                        <h2>React Calendar App</h2>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        {/* <UserSettings /> */}
                        <a href="#" id="user-link">
                            <i className="fa fa-user-circle fa-2x" />
                        </a>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Header;