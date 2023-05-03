import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';
import { defaultView } from 'config/appConfig';

export const initialState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  calendars: [],
  calendarSlotSelection: {},
  calendarEventSelection: {},
  calendarEvents: [],
  calendarViewSelection: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    usernameUpdated(state, action) {
      state.username = action.payload;
    },
    accessTokenUpdated(state, action) {
      state.accessToken = action.payload;
    },
    refreshTokenUpdated(state, action) {
      state.refreshToken = action.payload;
    },
    calendarsUpdated(state, action) {
      state.calendars = [...action.payload];
    },
    calendarAdded(state, action) {
      state.calendars = [...state.calendars, action.payload];
    },
    calendarUpdated(state, action) {
      state.calendars = state.calendars.map((calendar) =>
        calendar.id === action.payload.id ? { ...calendar, ...action.payload } : calendar
      );
    },
    calendarDeleted(state, action) {
      state.calendars = state.calendars.filter((calendar) => calendar.id !== action.payload);
    },
    calendarEventsUpdated(state, action) {
      state.calendarEvents = action.payload;
    },
    calendarEventAdded(state, action) {
      state.calendarEvents = [...state.calendarEvents, action.payload];
    },
    calendarEventUpdated(state, action) {
      state.calendarEvents = state.calendarEvents.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
    },
    calendarEventDeleted(state, action) {
      state.calendarEvents = state.calendarEvents.filter((event) => event.id !== action.payload);
    },
    calendarSlotSelectionUpdated(state, action) {
      state.calendarSlotSelection = action.payload;
    },
    calendarEventSelectionUpdated(state, action) {
      state.calendarEventSelection = action.payload;
    },
    calendarViewUpdated(state, action) {
      state.calendarViewSelection = action.payload;
    }
  }
});

export const {
  usernameUpdated,
  accessTokenUpdated,
  refreshTokenUpdated,
  calendarsUpdated,
  calendarAdded,
  calendarUpdated,
  calendarDeleted,
  calendarSlotSelectionUpdated,
  calendarEventSelectionUpdated,
  calendarEventsUpdated,
  calendarEventAdded,
  calendarEventDeleted,
  calendarEventUpdated,
  calendarViewUpdated
} = userSlice.actions;

export default userSlice.reducer;

//
// Memoized selectors
//

const calendarSlotSelector = (state) => state.user.calendarSlotSelection;
const calendarEventSelector = (state) => state.user.calendarEventSelection;
const calendarEventsSelector = (state) => state.user.calendarEvents;

export const calendarSelectionWithSlotAndEvent = createSelector(
  [calendarSlotSelector, calendarEventSelector],
  (calendarSlot, calendarEvent) => {
    if (!calendarSlot || !calendarEvent) return null;

    const isCalendarSlotSelected = Object.keys(calendarSlot).length > 0;
    const isCalendarEventSelected = Object.keys(calendarEvent).length > 0;

    const updateCompleteWithNewSlot = isCalendarSlotSelected && !isCalendarEventSelected;
    const updateCompleteWithNewEvent = isCalendarEventSelected && !isCalendarSlotSelected;

    if (updateCompleteWithNewSlot || updateCompleteWithNewEvent) {
      const update = {
        calendarSlot: calendarSlot,
        calendarEvent: calendarEvent
      };
      return update;
    } else return null;
  }
);

export const calendarEventsWithDateObjects = createSelector([calendarEventsSelector], (calendarEvents) => {
  if (!calendarEvents) return null;

  const clonedEvents = JSON.parse(JSON.stringify(calendarEvents));

  clonedEvents.forEach((event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
  });

  return clonedEvents;
});

//
// Bound action creators
//

export const logoutUser = () => (dispatch) => {
  dispatch({
    type: 'user/userLoggedOut'
  });
};

export const loginUser = (data) => async (dispatch) => {
  try {
    await userApi.post('/login', data).then((res) => {
      return Promise.resolve(res.data).then((res) => {
        dispatch(accessTokenUpdated(res.data.accessToken));
        dispatch(refreshTokenUpdated(res.data.refreshToken));
      });
    });
  } catch (e) {
    if (e.response && e.response.data.name === 'AuthorizationError') {
      // unauthorize user
      dispatch(accessTokenUpdated(null));
    }
    return Promise.reject(e);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/register', data);

    return Promise.resolve(res.data).then((res) => {
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
    });
  } catch (e) {
    return Promise.reject(e.response);
  }
};

export const retrieveUserData = () => async (dispatch) => {
  try {
    const res = await userApi.get('/data');

    return Promise.resolve(res.data).then((res) => {
      dispatch(usernameUpdated(res.username));
      dispatch(calendarsUpdated(res.calendars));
      dispatch(calendarEventsUpdated(res.calendarEvents));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const createCalendarEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/event', data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarEventAdded(res));
      dispatch(calendarEventSelectionUpdated(res));
      dispatch(calendarSlotSelectionUpdated({}));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateCalendarEvent = (event) => async (dispatch) => {
  try {
    const res = await userApi.post(`/event/update`, event);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarEventUpdated(res));
      dispatch(calendarEventSelectionUpdated(res));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteCalendarEvent = (eventId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/event/${eventId}/delete`);

    return Promise.resolve(res.data).then((res) => {
      // set slot selection to current date
      const start = new Date();
      const end = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      end.setHours(end.getHours() + 2, 0, 0, 0);

      const slot = {
        action: 'click',
        start,
        end,
        slots: [start]
      };

      dispatch(calendarEventDeleted(res.id));
      dispatch(updateCalendarEventSelection({}));
      dispatch(updateCalendarSlotSelection(slot));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const createCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/calendar', data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarAdded(res));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/calendar/update`, data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarUpdated(res));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteCalendar = (calendarId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/calendar/${calendarId}/delete`);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarDeleted(res.id));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateUsername = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/account/username/update`, data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(usernameUpdated(res.username));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateCalendarSlotSelection = (slot) => async (dispatch) => {
  const clonedSlot = _.cloneDeep(slot);

  // Convert dates to strings
  if (!_.isEmpty(clonedSlot)) {
    clonedSlot.start = clonedSlot.start.toISOString();
    clonedSlot.end = clonedSlot.end.toISOString();
    clonedSlot.slots = clonedSlot.slots.map((slot) => {
      return slot.toISOString();
    });
  }

  dispatch(calendarSlotSelectionUpdated(clonedSlot));
};

export const updateCalendarEventSelection = (event) => async (dispatch) => {
  const clonedEvent = _.cloneDeep(event);

  // Convert dates to strings
  if (!_.isEmpty(clonedEvent)) {
    clonedEvent.start = clonedEvent.start.toISOString();
    clonedEvent.end = clonedEvent.end.toISOString();
  }

  dispatch(calendarEventSelectionUpdated(clonedEvent));
};

export const onSelectSlot = (slot) => (dispatch) => {
  return Promise.all([dispatch(updateCalendarSlotSelection(slot)), dispatch(updateCalendarEventSelection({}))]);
};

export const onSelectEvent = (event) => (dispatch) => {
  return Promise.all([dispatch(updateCalendarEventSelection(event)), dispatch(updateCalendarSlotSelection({}))]);
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(calendarViewUpdated(view));
};

export const initializeCalendarView = () => async (dispatch) => {
  try {
    // Initial calendar slot
    const start = new Date();
    const end = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    end.setHours(end.getHours() + 2, 0, 0, 0);

    const initialSlot = {
      action: 'click',
      start,
      end,
      slots: [start]
    };

    return Promise.all([
      dispatch(updateCalendarSlotSelection(initialSlot)),
      dispatch(updateCalendarEventSelection({})),
      dispatch(onSelectView(defaultView))
    ]);
  } catch (e) {
    return Promise.reject(e);
  }
};

// NOT AN ACTION
export const updatePassword = (payload) => async () => {
  try {
    const res = await userApi.post(`/account/password/update`, payload);

    return Promise.resolve(res.data);
  } catch (e) {
    return Promise.reject(e);
  }
};
