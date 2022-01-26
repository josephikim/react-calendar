import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { logoutUser } from '../store/authSlice';
import { connect, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Header = ({ authenticated }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <div className="Header fixed-header">
      <Navbar collapseOnSelect expands="sm" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>React Calendar</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link to={`${location.pathname}`}>Home</Nav.Link>
              {authenticated ? (
                <Nav.Link onClick={() => dispatch(logoutUser())}>Logout</Nav.Link>
              ) : (
                <Nav.Link to={`${location.pathname}/login`}>Login</Nav.Link>
              )}
              <Nav.Link to={`${location.pathname}/account`}>Account</Nav.Link>
              <Nav.Link to={`${location.pathname}`}>templiteral</Nav.Link>
              <Nav.Link to={`${location.pathname}` + '/account'}>templiteralwstr</Nav.Link>
              <Nav.Link to={location.pathname}>valueonly</Nav.Link>
              <Nav.Link to={location}>{location}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default connect(null, null)(Header);
