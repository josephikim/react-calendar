import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const isLoggedIn = useSelector((state) => state.auth.authenticatedUser)
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      isLoggedIn && restricted ?
        <Redirect to='/calendar' />
        : <Component {...props} />
    )} />
  );
};

export default PublicRoute;