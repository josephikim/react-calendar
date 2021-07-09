import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const LoadingPage = () => {
  return (
    <div id='loading-page'>
      <Container>
        <Row>
          <Col xs={12}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
            <span>Loading...</span>
          </Col>
        </Row>
      </Container>
      
    </div>
  )
};

export default LoadingPage;