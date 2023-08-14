import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ContentWrapper from 'client/components/ContentWrapper';
import LoginForm from 'client/components/LoginForm';

const LoginPage = () => (
  <div>
    <Row className="justify-content-md-center">
      <Col md={4}>
        <ContentWrapper>
          <LoginForm />
        </ContentWrapper>
      </Col>
    </Row>
  </div>
);

export default LoginPage;
