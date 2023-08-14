import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Col } from 'react-bootstrap';
import { logoutUser } from 'client/store/userSlice';
import UserIndicator from './UserIndicator';
import styles from 'client/styles/Header.module.css';

const Header = ({ authenticated }) => {
  const dispatch = useDispatch();

  return (
    <Navbar className={`${styles.navbar} fixed-top`} bg="primary" variant="dark">
      <div className={styles.container}>
        <Col md={3}>{authenticated && <UserIndicator />}</Col>
        <Col md={6} className="text-center">
          <Navbar.Brand>React Calendar App</Navbar.Brand>
        </Col>
        <Col md={3}>
          <Nav className="justify-content-end">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/account">
              Account
            </Nav.Link>

            {authenticated ? null : (
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            )}

            {authenticated ? (
              <Nav.Link onClick={() => dispatch(logoutUser())}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Col>
      </div>
    </Navbar>
  );
};

export default Header;
