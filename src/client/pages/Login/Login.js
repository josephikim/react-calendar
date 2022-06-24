import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import LoginForm from './LoginForm';

import './Login.css';
import ContentWrapper from '../../components/ContentWrapper';

const Login = () => (
  <div className="Login">
    <Container>
      <Row>
        <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
          <ContentWrapper>
            <LoginForm />
          </ContentWrapper>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Login;
