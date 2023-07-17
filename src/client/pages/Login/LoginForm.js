import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { validateFields } from 'client/validation.js';
import { loginUser } from 'client/store/userSlice';

import './LoginForm.css';

const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: null
  },
  password: {
    value: '',
    validateOnChange: false,
    error: null
  }
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(initialState.username);
  const [password, setPassword] = useState(initialState.password);

  const handleBlur = (validationFunc, event) => {
    const {
      target: { name }
    } = event;

    switch (name) {
      case 'username':
        if (username.validateOnChange === false) {
          setUsername((data) => {
            const newState = {
              ...data,
              validateOnChange: true,
              error: validationFunc(username.value)
            };

            return newState;
          });
        }
        break;
      case 'password':
        if (password.validateOnChange === false) {
          setPassword((data) => {
            const newState = {
              ...data,
              validateOnChange: true,
              error: validationFunc(password.value)
            };

            return newState;
          });
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (validationFunc, event) => {
    const {
      target: { name, value }
    } = event;

    switch (name) {
      case 'username':
        setUsername((data) => {
          const newState = {
            ...data,
            value,
            error: data.validateOnChange ? validationFunc(value) : null
          };

          return newState;
        });
        break;
      case 'password':
        setPassword((data) => {
          const newState = {
            ...data,
            value,
            error: data.validateOnChange ? validationFunc(value) : null
          };

          return newState;
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const usernameError = validateFields.validateUsername(username.value);
    const passwordError = validateFields.validatePassword(password.value);

    if ([usernameError, passwordError].every((e) => e === false)) {
      // no errors submit the form
      const data = {
        username: username.value,
        password: password.value
      };

      dispatch(loginUser(data)).catch((e) => {
        const error = e.response?.data ?? e;
        const errorCode = error?.errorCode ?? null;
        alert(`Login error: ${error.message ?? error.statusText}`);

        // Update state to reflect response errors
        if (errorCode) {
          switch (errorCode) {
            case 'username':
              setUsername((data) => {
                const newState = {
                  ...data,
                  error: error.message
                };

                return newState;
              });
              break;

            case 'password':
              setPassword((data) => {
                const newState = {
                  ...data,
                  error: error.message
                };

                return newState;
              });
              break;
            default:
              break;
          }
        }
      });
    } else {
      // update state with errors
      if (usernameError) {
        setUsername((data) => {
          const newState = {
            ...data,
            validateOnChange: true,
            error: usernameError
          };

          return newState;
        });
      }

      if (passwordError) {
        setPassword((data) => {
          const newState = {
            ...data,
            validateOnChange: true,
            error: passwordError
          };

          return newState;
        });
      }
    }
  };

  return (
    <Form className="LoginForm">
      <div className="text-primary">
        <h4>User Login</h4>
      </div>

      <Form.Group controlId="username">
        <Form.Label className="text-primary">Username</Form.Label>
        <Form.Control
          name="username"
          placeholder="Enter username"
          onChange={(event) => handleChange(validateFields.validateUsername, event)}
          onBlur={(event) => handleBlur(validateFields.validateUsername, event)}
        />
      </Form.Group>

      <div className="text-danger">
        <small>{username.error}</small>
      </div>

      <Form.Group controlId="password">
        <Form.Label className="text-primary">Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={(event) => handleChange(validateFields.validatePassword, event)}
          onBlur={(event) => handleBlur(validateFields.validatePassword, event)}
        />
      </Form.Group>

      <div className="text-danger">
        <small>{password.error}</small>
      </div>

      <Button type="submit" name="login-form-btn" variant="primary" onClick={handleSubmit}>
        Login
      </Button>

      <div>
        <span>
          New user? Please <Link to="/register">register</Link>.
        </span>
      </div>
    </Form>
  );
};

export default LoginForm;
