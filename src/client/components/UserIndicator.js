import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';

const UserIndicator = () => {
  const username = useSelector((state) => state.user.username);

  return <Navbar.Text>Logged in as {username}</Navbar.Text>;
};

export default UserIndicator;
