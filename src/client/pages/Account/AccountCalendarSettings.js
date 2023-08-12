import React from 'react';
import { useSelector } from 'react-redux';
import { validateFields } from 'client/validation';
import { createCalendar, updateCalendar, deleteCalendar } from 'client/store/calendarsSlice';
import AccountCalendarSettingsItem from './AccountCalendarSettingsItem';
import './AccountCalendarSettings.css';

const AccountCalendarSettings = () => {
  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);

  const calendarIdsSorted = [...calendarIds]
    .sort((a, b) => calendars[b].id - calendars[a].id)
    .sort((a, b) => calendars[b].userDefault - calendars[a].userDefault)
    .sort((a, b) => (calendars[b].user_id === 'system') - (calendars[a].user_id === 'system'));

  return (
    <div className="calendar-settings">
      {calendarIdsSorted.map((id) => (
        <AccountCalendarSettingsItem
          key={id}
          inputType="text"
          settingType="name"
          calendar={calendars[id]}
          createAction={createCalendar}
          updateAction={updateCalendar}
          deleteAction={deleteCalendar}
          validation={validateFields.validateCalendarName}
        />
      ))}

      <AccountCalendarSettingsItem
        inputType="text"
        settingType="name"
        label="Add new calendar"
        placeholder="Enter calendar name"
        createAction={createCalendar}
        validation={validateFields.validateCalendarName}
        fixedEditMode={true}
      />
    </div>
  );
};

export default AccountCalendarSettings;
