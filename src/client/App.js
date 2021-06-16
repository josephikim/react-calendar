import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import CalendarPage from './pages/CalendarPage'
import LoginPage from './pages/LoginPage'
import AboutPage from './pages/AboutPage'
import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: true
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <BrowserRouter>
          <Switch>
            {/* <Route exact path="/profile/:userid" component={Profile} />
       <Route component={NoMatch} /> */}
            <Route path="/about" component={AboutPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/" render={() => (
              this.state.loggedIn ?
                <CalendarPage /> :
                <Redirect to='/login' />
            )} />
          </Switch>
        </BrowserRouter>
        <Footer />
      </div>
    )
  }
}

export default App