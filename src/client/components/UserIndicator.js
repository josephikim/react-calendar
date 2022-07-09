import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';

import 'client/styles/UserIndicator.css';

const UserIndicator = () => {
  const username = useSelector((state) => state.user.username);

  return <Navbar.Text className="UserIndicator">Logged in as {username}</Navbar.Text>;
};

export default UserIndicator;
