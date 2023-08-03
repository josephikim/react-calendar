import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import { validateFields } from 'client/validation';
import { updateUser } from 'client/store/userSlice';
import AccountUserSettingsItem from './AccountUserSettingsItem';
import './AccountUserSettings.css';

const initialState = {
  usernameInput: {
    value: '',
    validateOnChange: false,
    error: null,
    editMode: false
  },
  passwordInput: {
    value: '****',
    validateOnChange: false,
    editMode: false,
    error: null
  },
  newPasswordInput: {
    value: null,
    validateOnChange: false,
    error: null
  }
};

const AccountUserSettings = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const username = useSelector((state) => state.user.username);
  const [usernameInput, setUsernameInput] = useState(initialState.usernameInput);
  const [passwordInput, setPasswordInput] = useState(initialState.passwordInput);
  const [newPasswordInput, setNewPasswordInput] = useState(initialState.newPasswordInput);

  // update component state based on app state
  useEffect(() => {
    setUsernameInput((data) => {
      return {
        ...data,
        value: username
      };
    });
    setPasswordInput((data) => {
      return {
        ...initialState.passwordInput
      };
    });
    setUsernameInput((data) => {
      return {
        ...data,
        value: username
      };
    });
  }, [username]);

  const handleBlur = (validationFunc, event) => {
    const {
      target: { name }
    } = event;

    switch (name) {
      case 'username':
        if (usernameInput.validateOnChange === false) {
          setUsernameInput((data) => {
            const newState = {
              ...data,
              validateOnChange: true,
              error: validationFunc(usernameInput.value)
            };

            return newState;
          });
        }
        break;
      case 'newPassword':
        if (newPasswordInput.validateOnChange === false) {
          setNewPasswordInput((data) => {
            const newState = {
              ...data,
              validateOnChange: true,
              error: validationFunc(newPasswordInput.value)
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
        setUsernameInput((data) => {
          const newState = {
            ...data,
            value,
            error: data.validateOnChange ? validationFunc(value) : null
          };

          return newState;
        });
        break;
      case 'password':
        setPasswordInput((data) => {
          const newState = {
            ...data,
            value,
            error: data.validateOnChange ? validationFunc(value) : null
          };

          return newState;
        });
        break;
      case 'newPassword':
        setNewPasswordInput((data) => {
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

  const handleEdit = (id) => {
    const newState = {};

    switch (id) {
      case 'username':
        setUsernameInput((data) => {
          const newState = {
            ...data,
            editMode: true
          };

          return newState;
        });
        break;
      case 'password':
        setPasswordInput((data) => {
          const newState = {
            ...data,
            editMode: true
          };

          return newState;
        });
        break;
      default:
        break;
    }
  };

  const handleCancelEdit = (id) => {
    switch (id) {
      case 'username':
        setUsernameInput((data) => {
          return {
            ...initialState.usernameInput,
            value: usernameInput.value
          };
        });
        break;
      case 'password':
        setPasswordInput((data) => {
          return {
            ...initialState.passwordInput
          };
        });
        setNewPasswordInput((data) => {
          return {
            ...initialState.newPasswordInput
          };
        });
        break;
      default:
        break;
    }
  };

  const handleSubmitUsername = (event) => {
    event.preventDefault();

    const usernameError = validateFields.validateUsername(usernameInput.value);

    if (usernameError === false) {
      // no input errors, submit the form
      const data = {
        userId,
        username: usernameInput.value
      };

      dispatch(updateUser(data))
        .then((res) => {
          alert(`Successfully updated username`);
        })
        .catch((e) => {
          const error = e.response?.data ?? e;
          const errorCode = error?.errorCode ?? null;
          alert(`Error updating username: ${error.message ?? error.statusText}`);
          setUsernameInput((data) => {
            return {
              ...data,
              error: error.message
            };
          });
        });
    } else {
      // update state with input error
      setUsernameInput((data) => {
        return {
          ...data,
          validateOnChange: true,
          error: usernameError
        };
      });
    }
  };

  const handleSubmitPassword = (event) => {
    event.preventDefault();

    let passwordError = false;

    if (passwordInput.value === newPasswordInput.value) {
      passwordError = 'New passwordInput cannot match current passwordInput.';
    } else {
      passwordError = validateFields.validatePassword(newPasswordInput.value);
    }

    if (passwordError === false) {
      // no input errors, submit the form
      const data = {
        userId,
        password: passwordInput.value,
        newPassword: newPasswordInput.value
      };

      dispatch(updateUser(data))
        .then((res) => {
          alert(`Successfully updated password`);
          setPasswordInput((data) => {
            return {
              ...initialState.passwordInput
            };
          });
          setNewPasswordInput((data) => {
            return {
              ...initialState.newPasswordInput
            };
          });
        })
        .catch((e) => {
          const error = e.response?.data ?? e;
          const errorCode = error?.errorCode ?? null;
          alert(`Error updating password: ${error.message ?? error.statusText}`);
          setPasswordInput((data) => {
            return {
              ...data,
              error: error.message
            };
          });
        });
    } else {
      // update state with input error
      setPasswordInput((data) => {
        return {
          ...data,
          validateOnChange: true,
          error: passwordError
        };
      });
    }
  };

  return (
    <div className="AccountUserSettings">
      <Form>
        <AccountUserSettingsItem
          id="username"
          type="text"
          label="Username"
          value={usernameInput.value}
          error={usernameInput.error}
          editMode={usernameInput.editMode}
          onChange={(event) => handleChange(validateFields.validateUsername, event)}
          onBlur={(event) => handleBlur(validateFields.validateUsername, event)}
          onSubmit={(event) => handleSubmitUsername(event)}
          onEdit={(id) => handleEdit(id)}
          onCancel={(event, id) => handleCancelEdit(event, id)}
        />

        <AccountUserSettingsItem
          id="password"
          type="password"
          label={passwordInput.editMode === true ? 'Confirm Current Password' : 'Password'}
          value={passwordInput.value}
          error={passwordInput.error}
          editMode={passwordInput.editMode}
          onChange={(event) => handleChange(validateFields.validatePassword, event)}
          onSubmit={(event) => handleSubmitPassword(event)}
          onEdit={(event, id) => handleEdit(event, id)}
          onCancel={(event, id) => handleCancelEdit(event, id)}
        />

        {passwordInput.editMode === true && (
          <AccountUserSettingsItem
            id="newPassword"
            type="password"
            label="Enter New Password"
            value={newPasswordInput.value}
            error={newPasswordInput.error}
            editMode="true"
            onChange={(event) => handleChange(validateFields.validatePassword, event)}
            onBlur={(event) => handleBlur(validateFields.validatePassword, event)}
          />
        )}
      </Form>
    </div>
  );
};

export default AccountUserSettings;
