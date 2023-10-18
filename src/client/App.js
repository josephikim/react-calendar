import React from 'react';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import RegisterPage from 'client/pages/RegisterPage';
import LoginPage from 'client/pages/LoginPage';
import CalendarPage from 'client/pages/CalendarPage';
import SettingsPage from 'client/pages/SettingsPage';
import PublicRoute from 'client/components/PublicRoute';
import PrivateRoute from 'client/components/PrivateRoute';
import Header from 'client/components/Header';
import Footer from 'client/components/Footer';

const App = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const isAuthenticated = !!accessToken;

  return (
    <div>
      <Header authenticated={isAuthenticated} />
      <Container fluid>
        <Switch>
          <PublicRoute restricted={isAuthenticated} component={RegisterPage} path="/register" exact />
          <PublicRoute restricted={isAuthenticated} component={LoginPage} path="/login" exact />
          <PrivateRoute component={SettingsPage} path="/account" exact />
          <PrivateRoute component={CalendarPage} path="/" exact />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
};

export default App;
