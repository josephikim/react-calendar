import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
// import Register from './pages/Register'
// import Profile from './pages/Profile'
// import NoMatch from './pages/NoMatch'

import Header from './components/Header';

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
            {/* <Route exact path="/register" component={Register} /> */}
            {/* <Route exact path="/profile/:userid" component={Profile} />
       <Route component={NoMatch} /> */}
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route path="/" render={() => (
              this.state.loggedIn ?
                <Home /> :
                <Redirect to='/login' />
            )} />
          </Switch>
        </BrowserRouter>
      </div>

    )
  }
}

export default App