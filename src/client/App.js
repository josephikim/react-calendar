import React from 'react';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Calendar from './pages/Calendar/Calendar';
import Account from './pages/Account/Account';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';

const App = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userId = useSelector((state) => state.auth.userId);
  const isAuthenticated = accessToken && userId;

  return (
    <div className="App">
      <Header authenticated={isAuthenticated} />
      <Switch>
        <PublicRoute restricted={isAuthenticated ? true : false} component={Register} path="/register" exact />
        <PublicRoute restricted={isAuthenticated ? true : false} component={Login} path="/login" exact />
        <PrivateRoute component={Account} path="/account" exact />
        <PrivateRoute component={Calendar} path="/" exact />
        <PublicRoute restricted={false} component={NoMatch} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
