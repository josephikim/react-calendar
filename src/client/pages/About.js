import React from 'react';
import { Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <div id='about'>
      <Row className='about'>
        <Col xs={12}>
          <a
            href='https://github.com/josephikim/react-calendar'
            target='_blank'
            rel='noreferrer'
          >
            Github Repo
          </a>
        </Col>
      </Row>
    </div>
  )
};

export default About;