import React from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';
import { connect, useDispatch } from 'react-redux';
import UserIndicator from './UserIndicator';

import '../styles/Header.css';

const Header = ({ authenticated }) => {
  const dispatch = useDispatch();

  return (
    <Navbar className="Header fixed-header" collapseOnSelect expands="md" bg="primary" variant="dark">
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {authenticated && <UserIndicator />}
          </Col>
          <Col xs={12} md={6}>
            <Navbar.Brand>React Calendar App</Navbar.Brand>
          </Col>
          <Col xs={12} md={3}>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
              <Nav>
                <Nav.Link as={Link} to="/register">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/account">
                  Account
                </Nav.Link>
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
        </Row>
      </Container>
    </Navbar>
  );
};

export default connect(null, null)(Header);
