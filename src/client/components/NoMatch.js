import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../styles/NoMatch.css';

const NoMatch = () => {
  return (
    <div className='NoMatch'>
      <Container>
        <Row>
          <Col md={6}>
            <h3>404 - Not Found!</h3>
            <Link to='/'>
              Go Home
            </Link>
          </Col>
        </Row>
      </Container>
    </div >
  )
};

export default NoMatch;