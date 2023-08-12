import React from 'react';
import { useSelector } from 'react-redux';
import { validateFields } from 'client/validation';
import { updateUser } from 'client/store/userSlice';
import AccountUserSettingsItem from './AccountUserSettingsItem';
import './AccountUserSettings.css';

const AccountUserSettings = () => {
  const userId = useSelector((state) => state.user.id);
  const username = useSelector((state) => state.user.username);

  return (
    <div className="user-settings">
      <AccountUserSettingsItem
        userId={userId}
        inputType="text"
        settingType="username"
        label="Username"
        value={username}
        validation={validateFields.validateUsername}
        updateAction={updateUser}
        confirmationRequired={false}
      />

      <AccountUserSettingsItem
        userId={userId}
        inputType="password"
        settingType="password"
        label="Password"
        value="****"
        validation={validateFields.validatePassword}
        updateAction={updateUser}
        confirmationRequired={true}
      />
    </div>
  );
};

export default AccountUserSettings;
