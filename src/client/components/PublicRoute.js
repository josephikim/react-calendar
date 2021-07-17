import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const accessToken = useSelector((state) => state.auth.accessToken)
  
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      accessToken && restricted ?
        <Redirect to='/calendar' />
        : <Component {...props} />
    )} />
  );
};

export default PublicRoute;