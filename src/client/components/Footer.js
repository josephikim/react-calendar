import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <div className='fixed-bottom'>
      <Navbar expands='sm' bg='primary' variant='dark'>
        <Container className='justify-content-center'>
          <Navbar.Text>
            View on <a href='https://github.com/josephikim/react-calendar' target='_blank'>Github</a>
          </Navbar.Text>
        </Container>
      </Navbar>
    </div>
  )
}

export default Footer;