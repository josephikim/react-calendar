import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className='LoginPage'>
      <Container>
        <Row>
          <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }} >
            <LoginForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;