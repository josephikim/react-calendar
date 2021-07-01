import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';

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
        <Switch>
          <Route exact path="/">
            {this.state.loggedIn ?
              <CalendarPage /> :
              <Redirect to='/login' />
            }
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default App