import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import 'client/styles/NoMatch.css';

const NoMatch = () => (
  <Container className="NoMatch">
    <Row>
      <Col md={6}>
        <h3>404 - Not Found!</h3>
        <Link to="/">Go Home</Link>
      </Col>
    </Row>
  </Container>
);

export default NoMatch;
