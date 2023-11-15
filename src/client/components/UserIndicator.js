import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';
import styles from 'client/styles/UserIndicator.module.css';

const navbarTextStyles = {
  paddingTop: '0',
  paddingBottom: '0'
};

const UserIndicator = () => {
  const username = useSelector((state) => state.user.username);

  return (
    <Navbar.Text style={navbarTextStyles} className={styles.indicator}>
      Logged in as {username}
    </Navbar.Text>
  );
};

export default UserIndicator;
