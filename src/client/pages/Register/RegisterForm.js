import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { validateFields } from 'client/validation.js';
import { registerUser } from 'client/store/userSlice';

import './RegisterForm.css';

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
  },
  passwordConfirm: {
    value: '',
    error: null
  }
};
const RegisterForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(initialState.username);
  const [password, setPassword] = useState(initialState.password);
  const [passwordConfirm, setPasswordConfirm] = useState(initialState.passwordConfirm);

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
      case 'passwordConfirm':
        setPasswordConfirm((data) => {
          const newState = {
            ...data,
            value
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

    const usernameError = validateFields.validateUsername(username.value.trim());
    const passwordError = validateFields.validatePassword(password.value.trim());
    const passwordConfirmError = validateFields.validatePasswordConfirm(password.value, passwordConfirm.value.trim());

    if ([usernameError, passwordError, passwordConfirmError].every((e) => e === false)) {
      // no input errors, submit the form
      const data = {
        username: username.value.trim(),
        password: password.value.trim()
      };

      dispatch(registerUser(data)).catch((e) => {
        const error = e.response?.data ?? e;
        const errorCode = error?.errorCode ?? null;
        alert(`Registration error: ${error.message ?? error.statusText}`);

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
      // update state with input errors
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

      if (passwordConfirmError) {
        setPasswordConfirm((data) => {
          const newState = {
            ...data,
            error: passwordConfirmError
          };

          return newState;
        });
      }
    }
  };

  return (
    <Form className="RegisterForm">
      <div className="text-primary">
        <h4>New User Registration</h4>
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

      <Form.Group controlId="passwordConfirm">
        <Form.Label className="text-primary">Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="passwordConfirm"
          placeholder="Confirm password"
          onChange={(event) => handleChange(null, event)}
        />
      </Form.Group>

      <div className="text-danger">
        <small>{passwordConfirm.error}</small>
      </div>

      <Button type="submit" name="register-form-btn" variant="primary" onClick={handleSubmit}>
        Register
      </Button>

      <div>
        Already registered? Please <Link to="/login">login</Link>.
      </div>
    </Form>
  );
};

export default RegisterForm;
