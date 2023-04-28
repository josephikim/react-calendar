import React from 'react';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Register from 'client/pages/Register/Register';
import Login from 'client/pages/Login/Login';
import Calendar from 'client/pages/Calendar/Calendar';
import Account from 'client/pages/Account/Account';
import PublicRoute from 'client/components/PublicRoute';
import PrivateRoute from 'client/components/PrivateRoute';
import Header from 'client/components/Header';
import Footer from 'client/components/Footer';
import NoMatch from 'client/components/NoMatch';

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
