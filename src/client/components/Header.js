import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { logoutUser } from '../store/authSlice';
import { connect, useDispatch } from 'react-redux';

const Header = ({ authenticated }) => {
  const dispatch = useDispatch();

  return (
    <div className="Header fixed-header">
      <Navbar collapseOnSelect expands="sm" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>React Calendar</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              {authenticated ? (
                <Nav.Link onClick={() => dispatch(logoutUser())}>Logout</Nav.Link>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
              <Nav.Link href="/account">Account</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default connect(null, null)(Header);
