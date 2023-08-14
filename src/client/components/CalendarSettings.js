import React from 'react';
import { useSelector } from 'react-redux';
import { validateFields } from 'client/validation';
import { createCalendar, updateCalendar, deleteCalendar } from 'client/store/calendarsSlice';
import CalendarSettingsItem from './CalendarSettingsItem';

const CalendarSettings = () => {
  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);
  const userId = useSelector((state) => state.user.id);

  // sort calendars for render:
  // 1. system cals
  // 2. user default cal
  // 3. remaining user cals
  const calendarIdsSorted = [...calendarIds]
    .sort((a, b) => calendars[b].id - calendars[a].id)
    .sort((a, b) => calendars[b].userDefault - calendars[a].userDefault)
    .sort((a, b) => (calendars[b].user_id === 'system') - (calendars[a].user_id === 'system'));

  return (
    <div>
      {calendarIdsSorted.map((id) => (
        <CalendarSettingsItem
          key={id}
          id={`calendar-${id}`}
          userId={userId}
          inputType="text"
          settingType="name"
          calendar={calendars[id]}
          createAction={createCalendar}
          updateAction={updateCalendar}
          deleteAction={deleteCalendar}
          validation={validateFields.validateCalendarName}
        />
      ))}

      <CalendarSettingsItem
        id="new-calendar"
        userId={userId}
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

export default CalendarSettings;
