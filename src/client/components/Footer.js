import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Footer = () =>

  <div className='Footer fixed-bottom'>
    <Navbar expands='sm' bg='primary' variant='dark'>
      <Container className='justify-content-center'>
        <Navbar.Text>
          View on <a href='https://github.com/josephikim/react-calendar' rel='noreferrer' target='_blank'>Github</a>
        </Navbar.Text>
      </Container>
    </Navbar>
  </div>

export default Footer;