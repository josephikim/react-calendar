import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';
import { defaultView } from 'config/appConfig';

export const initialState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  calendars: [],
  slotSelection: {},
  eventSelection: {},
  events: [],
  viewSelection: null
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
    eventsUpdated(state, action) {
      state.events = action.payload;
    },
    eventAdded(state, action) {
      state.events = [...state.events, action.payload];
    },
    eventUpdated(state, action) {
      state.events = state.events.map((event) => (event.id === action.payload.id ? action.payload : event));
    },
    eventDeleted(state, action) {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
    slotSelectionUpdated(state, action) {
      state.slotSelection = action.payload;
    },
    eventSelectionUpdated(state, action) {
      state.eventSelection = action.payload;
    },
    viewUpdated(state, action) {
      state.viewSelection = action.payload;
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
  slotSelectionUpdated,
  eventSelectionUpdated,
  eventsUpdated,
  eventAdded,
  eventDeleted,
  eventUpdated,
  viewUpdated
} = userSlice.actions;

export default userSlice.reducer;

//
// Memoized selectors
//

const slotSelector = (state) => state.user.slotSelection;
const eventSelector = (state) => state.user.eventSelection;
const eventsSelector = (state) => state.user.events;

// Returns start and end value as Date objects
export const currentSelectionSelector = createSelector([slotSelector, eventSelector], (slot, event) => {
  const isSlotSelected = Object.keys(slot).length > 0 && Object.keys(event).length < 1;

  const isEventSelected = Object.keys(event).length > 0 && Object.keys(slot).length < 1;

  if (!isSlotSelected && !isEventSelected) return null;

  const newSlot = isSlotSelected ? { ...slot, start: new Date(slot.start), end: new Date(slot.end) } : {};

  const newEvent = isEventSelected ? { ...event, start: new Date(event.start), end: new Date(event.end) } : {};

  return {
    slot: newSlot,
    event: newEvent
  };
});

export const eventsWithDateObjectsSelector = createSelector([eventsSelector], (events) => {
  if (!events) return null;

  const clonedEvents = JSON.parse(JSON.stringify(events));

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
    userApi.post('/login', data).then((res) => {
      dispatch(usernameUpdated(res.data.username));
      dispatch(accessTokenUpdated(res.data.accessToken));
      dispatch(refreshTokenUpdated(res.data.refreshToken));
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
    userApi.post('/register', data).then((res) => {
      dispatch(usernameUpdated(res.data.username));
      dispatch(accessTokenUpdated(res.data.accessToken));
      dispatch(refreshTokenUpdated(res.data.refreshToken));
    });
  } catch (e) {
    return Promise.reject(e.response);
  }
};

export const fetchUserData = () => async (dispatch) => {
  try {
    const res = await userApi.get('/data');

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarsUpdated(data.calendars));
      dispatch(eventsUpdated(data.events));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const createEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/event', data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(eventAdded(data));
      dispatch(eventSelectionUpdated(data));
      dispatch(slotSelectionUpdated({}));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateEvent = (event) => async (dispatch) => {
  try {
    const res = await userApi.post(`/event/update`, event);

    return Promise.resolve(res.data).then((data) => {
      dispatch(eventUpdated(data));
      dispatch(eventSelectionUpdated(data));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/event/${eventId}/delete`);

    return Promise.resolve(res.data).then((data) => {
      // set slot selection to current date
      const newSlot = getCurrentDateSlot();

      dispatch(eventDeleted(data.id));
      dispatch(eventSelectionUpdated({}));
      dispatch(slotSelectionUpdated(newSlot));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const createCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/calendar', data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarAdded(data));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/calendar/update`, data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarUpdated(data));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteCalendar = (calendarId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/calendar/${calendarId}/delete`);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarDeleted(data.id));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateUsername = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/account/username/update`, data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(usernameUpdated(data.username));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

// convert Date objects to strings
export const onSelectSlot = (slot) => (dispatch) => {
  return Promise.all([dispatch(slotSelectionUpdated(slot)), dispatch(eventSelectionUpdated({}))]);
};

export const onSelectEvent = (event) => (dispatch) => {
  return Promise.all([dispatch(eventSelectionUpdated(event)), dispatch(slotSelectionUpdated({}))]);
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(viewUpdated(view));
};

export const initCalendarUI = () => async (dispatch) => {
  try {
    // Set initial calendar slot
    const newSlot = getCurrentDateSlot();

    return Promise.all([
      dispatch(slotSelectionUpdated(newSlot)),
      dispatch(eventSelectionUpdated({})),
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

// return start and end dates as strings spanning one hour starting from the nearest upcoming hour
const getCurrentDateSlot = () => {
  const start = new Date();
  const end = new Date();
  start.setHours(start.getHours(), 0, 0, 0);
  end.setHours(end.getHours() + 1, 0, 0, 0);

  return {
    action: 'click',
    start: start.toISOString(),
    end: end.toISOString(),
    slots: [start.toISOString()]
  };
};
