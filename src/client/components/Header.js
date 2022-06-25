import React from 'react';
import { Navbar, Nav, Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import UserIndicator from './UserIndicator';

import '../styles/Header.css';

const Header = ({ authenticated }) => {
  const dispatch = useDispatch();

  return (
    <Navbar className="Header fixed-top" collapseOnSelect expands="md" bg="primary" variant="dark">
      <Container>
        <Col md={3}>{authenticated && <UserIndicator />}</Col>
        <Col md={6}>
          <Navbar.Brand>React Calendar App</Navbar.Brand>
        </Col>
        <Col md={3}>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
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
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
};

export default Header;
