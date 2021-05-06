import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Calendar from './pages/Calendar'
import Login from './pages/Login'
// import About from './pages/About'
// import Register from './pages/Register'
// import Profile from './pages/Profile'
// import NoMatch from './pages/NoMatch'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: true
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => (
            this.state.loggedIn ?
            <Calendar /> :
            <Redirect to='/login' />
          )} />
          <Route exact path="/login" component={Login} />
          {/* <Route exact path="/register" component={Register} /> */}
          {/* <Route exact path="/about" component={About} />
       <Route exact path="/profile/:userid" component={Profile} />
       <Route component={NoMatch} /> */}
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App