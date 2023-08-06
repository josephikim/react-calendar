import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Form } from 'react-bootstrap';
import { validateFields } from 'client/validation';
import { createCalendar, updateCalendar, deleteCalendar } from 'client/store/calendarsSlice';
import AccountCalendarSettingsItem from './AccountCalendarSettingsItem';
import './AccountCalendarSettings.css';

const initialState = {
  newCalendar: {
    value: '',
    validateOnChange: false,
    error: null
  }
};

// Returns object with calendar ids as keys and settings objects as values
const getCalendarsState = (calendars) => {
  const newState = {};

  Object.keys(calendars).forEach((key) => {
    const calendarState = {
      value: calendars[key].name,
      validateOnChange: false,
      error: null,
      editMode: false
    };

    newState[key] = calendarState;
  });

  return newState;
};

const AccountCalendarSettings = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);
  const [calendarsSettings, setCalendarsSettings] = useState(getCalendarsState(calendars));
  const [newCalendarSettings, setNewCalendarSettings] = useState(initialState.newCalendar);

  // update component state based on app state
  useEffect(() => {
    setCalendarsSettings(getCalendarsState(calendars));
    setNewCalendarSettings(initialState.newCalendar);
  }, [calendars]);

  const handleBlur = (validationFunc, event) => {
    const {
      target: { id }
    } = event;

    const settings = calendarsSettings[id];

    if (!settings) return;

    if (settings.editMode === true && settings.validateOnChange === false) {
      setCalendarsSettings((data) => {
        return {
          ...data,
          [id]: {
            ...data[id],
            validateOnChange: true,
            error: validationFunc(data[id].value)
          }
        };
      });
    }
  };

  const handleChange = (validationFunc, event) => {
    const {
      target: { id, value }
    } = event;

    if (id === 'newCalendar') {
      setNewCalendarSettings((data) => {
        return {
          ...data,
          value,
          error: data.validateOnChange ? validationFunc(value) : null
        };
      });
    } else {
      if (!calendarsSettings[id]) return;

      setCalendarsSettings((data) => {
        return {
          ...data,
          [id]: {
            ...data[id],
            value,
            error: data[id].validateOnChange ? validationFunc(value) : null
          }
        };
      });
    }
  };

  // update edit mode
  const handleEdit = (id) => {
    if (!calendarsSettings[id]) return;

    setCalendarsSettings((data) => {
      return {
        ...data,
        [id]: {
          ...data[id],
          editMode: true
        }
      };
    });
  };

  // update edit mode and reset settings
  const handleCancelEdit = (id) => {
    // check app state for calendar
    const calendar = calendars[id];
    if (!calendar) return;

    // check local state for calendar settings
    if (!calendarsSettings[id]) return;

    setCalendarsSettings((data) => {
      return {
        ...data,
        [id]: {
          ...data[id],
          value: calendar.name,
          validateOnChange: false,
          error: null,
          editMode: false
        }
      };
    });
  };

  const handleDeleteCalendar = (id) => {
    event.preventDefault();

    // Retrieve target calendar
    const calendar = calendars[id];

    // Check for valid target
    if (!calendar) {
      alert('Calendar not found!');
      return;
    }

    const isValidTarget = calendar.user_id === userId && calendar.userDefault === false;

    if (!isValidTarget) {
      alert('Deletion not allowed!');
      return;
    }

    dispatch(deleteCalendar(id))
      .then(() => {
        alert(`Calendar "${calendar.name}" deleted!`);
      })
      .catch((e) => {
        const error = e.response?.data ?? e;
        alert(`Error deleting calendar: ${error.message}`);
      });
  };

  const handleAddCalendar = (event) => {
    event.preventDefault();

    const trimmedCalendarName = newCalendarSettings.value.trim();

    const inputError = validateFields.validateCalendarName(trimmedCalendarName);

    if (inputError === false) {
      // no input errors, submit the form
      const data = {
        name: trimmedCalendarName
      };

      dispatch(createCalendar(data))
        .then(() => {
          alert('New calendar created!');
        })
        .catch((e) => {
          const error = e.response?.data ?? e;
          alert(`Error creating calendar: ${error.message ?? error.statusText}`);
        });
    } else {
      // update state with input error
      setNewCalendarSettings((data) => {
        return {
          ...data,
          validateOnChange: true,
          error: inputError
        };
      });
    }
  };

  const handleUpdateCalendar = (event, id) => {
    event.preventDefault();

    // Check app state for target calendar
    if (!calendars[id]) {
      alert('Calendar not found!');
      return;
    }

    const calendarName = calendars[id].name;
    const trimmedNewCalendarName = calendarsSettings[id]?.value.trim();

    // Check for no change in calendar name
    if (trimmedNewCalendarName === calendarName) {
      alert('No change detected!');
      return;
    }

    // Check for calendar name input errors
    const inputError = validateFields.validateCalendarName(trimmedNewCalendarName);

    if (!inputError) {
      // no input errors, submit the form
      const data = {
        id,
        name: trimmedNewCalendarName
      };

      dispatch(updateCalendar(data))
        .then(() => {
          alert(`Successfully updated calendar: "${data.name}"`);
        })
        .catch((e) => {
          const error = e.response?.data ?? e;
          const errorCode = error?.errorCode ?? null;
          alert(`Error updating calendar: ${error.message ?? error.statusText}`);
          if (errorCode === 'calendar') {
            setCalendarsSettings((data) => {
              return {
                ...data,
                [id]: {
                  ...data[id],
                  error: error.message
                }
              };
            });
          }
        });
    } else {
      // update state with input error
      setCalendarsSettings((data) => {
        return {
          ...data,
          [id]: {
            ...data[id],
            validateOnChange: true,
            error: inputError
          }
        };
      });
    }
  };

  // prepare array of settings items for render
  const calendarSettingsItems = [];

  Object.keys(calendars).forEach((key) => {
    // use settings from local state if found
    const settings = calendarsSettings[key] ?? {
      value: calendars[key].name,
      validateOnChange: false,
      error: null,
      editMode: false
    };

    calendarSettingsItems.push({
      ...calendars[key],
      ...settings
    });
  });

  calendarSettingsItems
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => b.userDefault - a.userDefault)
    .sort((a, b) => (b.user_id === 'system') - (a.user_id === 'system'));

  return (
    <Form className="AccountCalendarSettings">
      {calendarSettingsItems.map((item) => (
        <AccountCalendarSettingsItem
          key={item.id}
          id={item.id}
          type="text"
          value={item.value}
          isSystemCalendar={item.user_id === 'system'}
          isDefaultCalendar={item.userDefault}
          error={item.error}
          editMode={item.editMode}
          onChange={(event) => handleChange(validateFields.validateCalendarName, event)}
          onBlur={(event) => handleBlur(validateFields.validateCalendarName, event)}
          onSubmit={(event, id) => handleUpdateCalendar(event, id)}
          onDelete={(event, id) => handleDeleteCalendar(event, id)}
          onEdit={(id) => handleEdit(id)}
          onCancel={(id) => handleCancelEdit(id)}
        />
      ))}

      <AccountCalendarSettingsItem
        id="newCalendar"
        type="text"
        label="Add Calendar"
        placeholder="Enter calendar name"
        value={newCalendarSettings.value}
        error={newCalendarSettings.error}
        editMode={true}
        onChange={(event) => handleChange(validateFields.validateCalendarName, event)}
        onSubmit={(event) => handleAddCalendar(event)}
      />
    </Form>
  );
};

export default AccountCalendarSettings;
