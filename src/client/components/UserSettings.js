import React from 'react';
import { useSelector } from 'react-redux';
import { validateFields } from 'client/validation';
import { updateUser } from 'client/store/userSlice';
import UserSettingsItem from './UserSettingsItem';
import TimeZoneSettingsItem from './TimeZoneSettingsItem';

const UserSettings = () => {
  const userId = useSelector((state) => state.user.id);
  const username = useSelector((state) => state.user.username);
  const gmtOffset = useSelector((state) => state.user.gmtOffset);

  return (
    <div>
      <UserSettingsItem
        userId={userId}
        inputType="text"
        settingType="username"
        label="Username"
        value={username}
        validation={validateFields.validateUsername}
        updateAction={updateUser}
        confirmationRequired={false}
      />

      <UserSettingsItem
        userId={userId}
        inputType="password"
        settingType="password"
        label="Password"
        value="****"
        validation={validateFields.validatePassword}
        updateAction={updateUser}
        confirmationRequired={true}
      />

      <TimeZoneSettingsItem userId={userId} gmtOffset={gmtOffset || -8} />
    </div>
  );
};

export default UserSettings;
