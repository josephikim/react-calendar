import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route {...rest} render={props => (
      this.props.user ?
        <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.authenticatedUser
  };
};

export default connect(mapStateToProps)(PrivateRoute);