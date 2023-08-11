import React from 'react';
import { useSelector } from 'react-redux';
import { validateFields } from 'client/validation';
import { updateUser } from 'client/store/userSlice';
import AccountUserSettingsItem from './AccountUserSettingsItem';
import './AccountUserSettings.css';

const AccountUserSettings = () => {
  const username = useSelector((state) => state.user.username);

  return (
    <div className="user-settings">
      <AccountUserSettingsItem
        id="username"
        type="text"
        label="Username"
        value={username}
        validation={validateFields.validateUsername}
        action={updateUser}
        confirmationRequired={false}
      />

      <AccountUserSettingsItem
        id="password"
        type="password"
        label="Password"
        value="****"
        validation={validateFields.validatePassword}
        action={updateUser}
        confirmationRequired={true}
      />
    </div>
  );
};

export default AccountUserSettings;
