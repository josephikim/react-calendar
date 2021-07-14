import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  // const isLoggedIn = useSelector((state) => state.auth.authenticatedUser)
  const isLoggedIn = true;
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route {...rest} render={props => (
      isLoggedIn ?
        <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );
};

export default PrivateRoute;