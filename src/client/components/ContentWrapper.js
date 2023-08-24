import React from 'react';
import { Row, Col } from 'react-bootstrap';

const style = { marginRight: '7%', marginLeft: '7%', marginTop: '2rem', marginBottom: '2rem' };

const ContentWrapper = ({ children }) => (
  <Row>
    <Col>
      <div style={style}>{children}</div>
    </Col>
  </Row>
);

export default ContentWrapper;
