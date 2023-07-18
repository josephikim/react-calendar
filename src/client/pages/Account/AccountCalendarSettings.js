import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import _ from 'lodash';
import { validateFields } from 'client/validation';
import { createCalendar, updateCalendar, deleteCalendar } from 'client/store/userSlice';
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

  calendars.forEach((calendar) => {
    const calendarState = {
      value: calendar.name,
      validateOnChange: false,
      error: null,
      editMode: false
    };

    newState[calendar.id] = calendarState;
  });

  return newState;
};

const AccountCalendarSettings = () => {
  const dispatch = useDispatch();
  const calendars = useSelector((state) => state.user.calendars);
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

    if (!calendars[id]) return;

    if (calendars[id].validateOnChange === false) {
      setCalendarsSettings((data) => {
        const newState = {
          ...data,
          [id]: {
            ...data[id],
            validateOnChange: true,
            error: validationFunc(data[id].value)
          }
        };

        return newState;
      });
    }
  };

  const handleChange = (validationFunc, event) => {
    const {
      target: { id, value }
    } = event;

    // update new calendar settings
    if (id === 'newCalendar') {
      setNewCalendarSettings((data) => {
        const newState = {
          ...data,
          value,
          error: data.validateOnChange ? validationFunc(value) : null
        };

        return newState;
      });
    } else {
      // update calendar settings
      if (!calendarsSettings[id]) return;

      setCalendarsSettings((data) => {
        const newState = {
          ...data,
          [id]: {
            ...data[id],
            value,
            error: data[id].validateOnChange ? validationFunc(value) : null
          }
        };

        return newState;
      });
    }
  };

  // update edit mode
  const handleEdit = (id) => {
    if (!calendarsSettings[id]) return;

    setCalendarsSettings((data) => {
      const newState = {
        ...data,
        [id]: {
          ...data[id],
          editMode: true
        }
      };

      return newState;
    });
  };

  // update edit mode and reset settings
  const handleCancelEdit = (id) => {
    if (!calendarsSettings[id]) return;

    setCalendarsSettings((data) => {
      const newState = {
        ...data,
        [id]: {
          ...data[id],
          value: calendars[id].name,
          validateOnChange: false,
          error: null,
          editMode: false
        }
      };

      return newState;
    });
  };

  const handleDeleteCalendar = (id) => {
    // Check if calendar is eligible for deletion
    const calendar = calendars.filter((calendar) => calendar.id === id)[0];

    const isValidCalendar = !calendar.systemCalendar && !calendar.userDefault;

    if (!isValidCalendar) return;

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

    const inputError = validateFields.validateCalendarName(newCalendarSettings.value.trim());

    if (inputError === false) {
      // no input errors, submit the form
      const data = {
        name: newCalendarSettings.value.trim(),
        visibility: true
      };

      dispatch(createCalendar(data))
        .then(() => {
          alert('New calendar created!');
        })
        .catch((e) => {
          const error = e.response?.data ?? e;
          const errorCode = error?.errorCode ?? null;
          alert(`Error creating calendar: ${error.message ?? error.statusText}`);

          // Update state to reflect response errors
          if (errorCode === 'calendar') {
            setNewCalendarSettings((data) => {
              const newState = {
                ...data,
                error: error.message
              };

              return newState;
            });
          }
        });
    } else {
      // update state with input error
      setNewCalendarSettings((data) => {
        const newState = {
          ...data,
          validateOnChange: true,
          error: inputError
        };

        return newState;
      });
    }
  };

  const handleUpdateCalendar = (event, id) => {
    event.preventDefault();

    // Check for valid input
    const name = calendars.filter((calendar) => calendar.id === id)[0].name;

    const newName = calendarsSettings[id].value;

    if (newName.trim() === name.trim()) {
      alert('No change detected!');
      return;
    }

    const inputError = validateFields.validateCalendarName(newName.trim());

    if (!inputError) {
      // no input errors, submit the form
      const data = {
        id,
        name: newName.trim()
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
              const newState = {
                ...data,
                [id]: {
                  ...data[id],
                  error: error.message
                }
              };

              return newState;
            });
          }
        });
    } else {
      // update state with input error
      setCalendarsSettings((data) => {
        const newState = {
          ...data,
          [id]: {
            ...data[id],
            validateOnChange: true,
            error: calendarNameError
          }
        };

        return newState;
      });
    }
  };

  // prepare data for render
  let calendarSettingsItems = [];

  calendars.map((calendar) => {
    const newItem = {
      ...calendar,
      ...calendarsSettings[calendar.id]
    };
    calendarSettingsItems.push(newItem);
  });

  calendarSettingsItems
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => b.userDefault - a.userDefault)
    .sort((a, b) => b.systemCalendar - a.systemCalendar);

  return (
    <Form className="AccountCalendarSettings">
      {calendarSettingsItems.map((item) => (
        <AccountCalendarSettingsItem
          key={item.id}
          id={item.id}
          type="text"
          value={item.value}
          isSystemCalendar={item.systemCalendar}
          isDefaultCalendar={item.userDefault}
          error={item.error}
          editMode={item.editMode}
          onChange={(event) => handleChange(validateFields.validateCalendarName, event)}
          onBlur={(event) => handleBlur(validateFields.validateCalendarName, event)}
          onSubmit={(event, id) => handleUpdateCalendar(event, id)}
          onDelete={(id) => handleDeleteCalendar(id)}
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
