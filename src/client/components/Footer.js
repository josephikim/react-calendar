import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
// import { connect } from 'react-redux';
// import axios from 'axios'

class Footer extends Component {
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
            <div id="footer">
                <Row className="footer align-items-center">
                    <Col xs={12}>
                        <a
                            href="#"
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

export default Footer;