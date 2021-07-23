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
    error: '',
    editMode: false
  },
  password: {
    value: 'asdf',
    validateOnChange: false,
    error: '',
    editMode: false
  },
  newPassword: {
    value: '',
    validateOnChange: false,
    error: '',
    editMode: false
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

  handleSubmitUsername = (event) => {
    event.preventDefault();

    const { username } = this.state;
    const usernameError = validateFields.validateUsername(username.value);

    if (usernameError === false) {
      // no input errors, submit the form
      const data = {
        _id: this.props.id,
        username: username.value,
      }

      this.props.updateUsername(data)
        .then(() => {
          alert('Username updated!')
        })
        .catch(err => {
          const error = err.error;
          this.setState(state => ({
            username: {
              ...state.username,
              error: error
            }
          }));
        });
    } else {
      // update state with input errors
      this.setState(state => ({
        username: {
          ...state.username,
          validateOnChange: true,
          error: usernameError
        }
      }));
    }
  }

  handleSubmitPassword = (event) => {
    event.preventDefault();

    const { password, newPassword } = this.state;
    const newPasswordError = validateFields.validatePassword(newPassword.value);

    if (newPasswordError === false) {
      // no input errors, submit the form
      const data = {
        _id: this.props.id,
        password: password.value,
        newPassword: newPassword.value
      }

      this.props.updatePassword(data)
        .then(() => {
          alert('Password updated!')
        })
        .catch(err => {
          const error = err.error;
          this.setState(state => ({
            password: {
              ...state.password,
              error: error
            }
          }));
        });
    } else {
      // update state with input errors
      this.setState(state => ({
        newPassword: {
          ...state.newPassword,
          validateOnChange: true,
          error: newPasswordError
        }
      }));
    }
  }

  handleEdit = (id) => {
    this.setState(state => ({
      [id]: {
        ...state[id],
        editMode: !state[id].editMode
      }
    }))
  }

  handleCancel = (id) => {
    this.setState({
      [id]: {
        ...initialState[id],
        value: id === 'username' ? this.props.username : initialState[id].value
      }
    })
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
            value={this.state.username.value}
            editMode={this.state.username.editMode}
            error={this.state.username.error}
            onChange={event => this.handleChange(validateFields.validateUsername, event)}
            onBlur={event => this.handleBlur(validateFields.validateUsername, event)}
            onSubmit={(event) => this.handleSubmitUsername(event)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)} />

          <AccountSettingsItem
            id='password'
            type='password'
            label={this.state.password.editMode ? 'Confirm Current Password' : 'Password'}
            value={this.state.password.value}
            editMode={this.state.password.editMode}
            error={this.state.password.error}
            onChange={event => this.handleChange(null, event)}
            onSubmit={(event) => this.handleSubmitPassword(event)}
            onEdit={(event, id) => this.handleEdit(event, id)}
            onCancel={(event, id) => this.handleCancel(event, id)} />

          {this.state.password.editMode &&
            <AccountSettingsItem
              id='newPassword'
              type='password'
              label='Enter New Password'
              value={this.state.newPassword.value}
              editMode={this.state.password.editMode}
              error={this.state.newPassword.error}
              onChange={event => this.handleChange(null, event)}
              onBlur={event => this.handleBlur(validateFields.validatePassword, event)} />
          }
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    id: state.auth.id
  };
};

const mapActionsToProps = {
  updateUser
}

export default connect(mapStateToProps, mapActionsToProps)(AccountSettings);