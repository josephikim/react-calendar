import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../styles/Header.css';

const Header = () => {
  return (
    <div className='fixed-header'>
      <Navbar collapseOnSelect expands='sm' bg='primary' variant='dark'>
        <Container>
          <Navbar.Brand href='/'>React Calendar App</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end' >
            <Nav>
              <Nav.Link href='/'>Home</Nav.Link>
              <Nav.Link href='/login'>Login</Nav.Link>
              <Nav.Link href='/about'>About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar >
    </div>
  )
};

export default Header;