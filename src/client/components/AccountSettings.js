import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { validateFields } from '../../validation';
import { updateUser } from '../actions/userActions';

import AccountSettingsItem from './AccountSettingsItem';

import '../styles/AccountSettings.css';

const initialState = {
  username: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  password: {
    value: 'asdf',
    validateOnChange: false,
    error: ''
  },
  newPassword: {
    value: '',
    validateOnChange: false,
    error: ''
  }
}
class AccountSettings extends Component {
  constructor(...args) {
    super(...args)
    this.state = initialState
  }

  componentDidMount = () => {
    this.setState(state => ({
      username: {
        ...state.username,
        value: this.props.username
      }
    }))
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.username !== prevProps.username) {
      this.setState(state => ({
        username: {
          ...state.username,
          value: this.props.username
        }
      }))
    }
  }

  handleBlur = (validationFunc, event) => {
    const { target: { name } } = event;

    if (this.state[name]['validateOnChange'] === false) {
      this.setState(state => ({
        [name]: {
          ...state[name],
          validateOnChange: true,
          error: validationFunc(state[name].value)
        }
      }));
    }
    return;
  }

  handleChange = (validationFunc, event) => {
    const { target: { name, value } } = event;

    if (validationFunc === null) { // handle fields without validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value
        }
      }));
    } else {  // handle fields with validation
      this.setState(state => ({
        [name]: {
          ...state[name],
          value: value,
          error: state[name]['validateOnChange'] ? validationFunc(value) : ''
        }
      }));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { username, password, newPassword } = this.state;
    const usernameError = validateFields.validateUsername(username.value);
    const newPasswordError = validateFields.validatePassword(newPassword.value);

    if ([usernameError, newPasswordError].every(e => e === false)) {
      // no input errors, submit the form
      const data = {
        _id: this.props.userId,
        username: username.value,
        password: password.value,
        newPassword: newPassword.value
      }

      this.props.updateUser(data)
        .then(() => {
          alert('changes saved!')
        })
        .catch(err => {
          const errorsObj = err.errors ? err.errors : err.error;
          for (const property in errorsObj) {
            this.setState(state => ({
              [property]: {
                ...state[property],
                error: errorsObj[property]
              }
            }));
          }
        });
    } else {
      // update state with input errors
      this.setState(state => ({
        username: {
          ...state.username,
          validateOnChange: true,
          error: usernameError
        },
        newPassword: {
          ...state.newPassword,
          validateOnChange: true,
          error: newPasswordError
        }
      }));
    }
  }

  handleEdit = () => {
    this.setState(state => ({
      password: {
        ...state.password,
        value: ''
      },
      editMode: !this.state.editMode
    }))
  }

  handleCancel = () => {
    this.setState(state => ({
      ...initialState,
      username: {
        ...state.username,
        value: this.props.username
      }
    }))
  }

  render() {
    return (
      <div className='AccountSettings'>
        <Form>
          <Container>
            <Row>
              <Col>
                <div className='heading text-primary'>
                  <h4>Account Settings</h4>
                </div>
              </Col>
            </Row>
          </Container>

          <AccountSettingsItem
            id='username'
            type='text'
            label='Username'
            defaultValue={this.props.username}
            onChange={event => this.handleChange(validateFields.validateUsername, event)}
            onBlur={event => this.handleBlur(validateFields.validateUsername, event)}
            error={this.state.username.error}
          />

          <AccountSettingsItem
            id='password'
            type='password'
            label={this.state.editMode ? 'Enter Current Password' : 'Password'}
            defaultValue={this.state.password.value}
            onChange={event => this.handleChange(null, event)}
          />

          {this.state.editMode === true &&
            <AccountSettingsItem
              id='newPassword'
              type='password'
              label='Enter New Password'
              defaultValue={this.state.newPassword.value}
              onChange={event => this.handleChange(validateFields.validatePassword, event)}
              onBlur={event => this.handleBlur(validateFields.validatePassword, event)}
              onSubmit={this.handleSubmit}
            />
          }

        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    userId: state.auth.userId
  };
};

const mapActionsToProps = {
  updateUser
}

export default connect(mapStateToProps, mapActionsToProps)(AccountSettings);