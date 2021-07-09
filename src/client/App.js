import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';

const initialState = {};

class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState;
  }

  render() {
    return (
      <div className='App'>
        <Header />
        <Switch>
          <PublicRoute restricted={false} component={HomePage} path="/" exact />
          <PublicRoute restricted={this.props.user ? true : false} component={LoginPage} path="/login" exact />
          <PrivateRoute component={CalendarPage} path="/calendar" exact />
          <PublicRoute restricted={false} component={NoMatch} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.authenticatedUser
  };
};

export default connect(mapStateToProps)(App);