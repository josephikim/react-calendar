import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div id='about-page'>
      <Container>
        <Row>
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
      </Container>
      
    </div>
  )
};

export default AboutPage;