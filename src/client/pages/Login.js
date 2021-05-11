import React, { Component } from 'react'
import { Row } from 'react-bootstrap'
import { connect } from 'react-redux';

import LoginForm from '../components/LoginForm';

class Login extends Component {
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
      <div id="login">
        <Row className="align-items-center">
          <LoginForm />
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

export default connect(mapStateToProps)(Login);