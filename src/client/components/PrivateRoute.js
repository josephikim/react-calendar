import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tokenSaved } from '../utils/tokenSaved';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route {...rest} render={props => (
      tokenSaved() ?
        <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );
};

export default PrivateRoute;