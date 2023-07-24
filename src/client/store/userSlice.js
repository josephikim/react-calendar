import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';
import { defaultView } from 'config/appConfig';

export const initialState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  roles: [],
  calendars: {},
  rbcSelection: {},
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
    rolesUpdated(state, action) {
      state.roles = action.payload;
    },
    calendarsUpdated(state, action) {
      // convert array of objects to POJO
      const newState = {};

      action.payload.forEach((element) => {
        newState[element.id] = element;
      });

      state.calendars = newState;
    },
    calendarAdded(state, action) {
      state.calendars = {
        ...state.calendars,
        [action.payload.id]: action.payload
      };
    },
    calendarUpdated(state, action) {
      state.calendars = {
        ...state.calendars,
        [action.payload.id]: action.payload
      };
    },
    calendarDeleted(state, action) {
      state.calendars = _.omit(state.calendars, [action.payload]);
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
    rbcSelectionUpdated(state, action) {
      state.rbcSelection = action.payload;
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
  rolesUpdated,
  calendarsUpdated,
  calendarAdded,
  calendarUpdated,
  calendarDeleted,
  rbcSelectionUpdated,
  eventsUpdated,
  eventAdded,
  eventDeleted,
  eventUpdated,
  viewUpdated
} = userSlice.actions;

export default userSlice.reducer;

const eventsSelector = (state) => state.user.events;
const rbcSelectionSelector = (state) => state.user.rbcSelection;

//
// Memoized selectors
//

// returns times as Date objects
export const deserializedEventsSelector = createSelector([eventsSelector], (events) => {
  const result = events.map((event) => {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    };
  });

  return result;
});

// returns times as Date objects
export const deserializedRbcSelectionSelector = createSelector([rbcSelectionSelector], (rbcSelection) => {
  const selectedSlot = rbcSelection.slot;
  const selectedEvent = rbcSelection.event;

  const deserializedSlot = selectedSlot
    ? {
        ...selectedSlot,
        start: new Date(selectedSlot.start),
        end: new Date(selectedSlot.end),
        slots: selectedSlot.slots.map((slot) => new Date(slot))
      }
    : null;

  const deserializedEvent = selectedEvent
    ? { ...selectedEvent, start: new Date(selectedEvent.start), end: new Date(selectedEvent.end) }
    : null;

  const result = {
    slot: deserializedSlot,
    event: deserializedEvent
  };

  return result;
});

//
// Bound action creators
//

export const onSelectSlot = (serializedSlot) => (dispatch) => {
  const newState = {
    slot: serializedSlot,
    event: null
  };

  dispatch(rbcSelectionUpdated(newState));
};

export const onSelectEvent = (serializedEvent) => (dispatch) => {
  const newState = {
    slot: null,
    event: serializedEvent
  };

  dispatch(rbcSelectionUpdated(newState));
};

export const logoutUser = () => (dispatch) => {
  dispatch({
    type: 'user/userLoggedOut'
  });
};

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/user/login', data);

    dispatch(usernameUpdated(res.data.username));
    dispatch(accessTokenUpdated(res.data.accessToken));
    dispatch(refreshTokenUpdated(res.data.refreshToken));
    dispatch(rolesUpdated(res.data.roles));
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
    const res = await userApi.post('/user/register', data);

    dispatch(usernameUpdated(res.data.username));
    dispatch(accessTokenUpdated(res.data.accessToken));
    dispatch(refreshTokenUpdated(res.data.refreshToken));
    dispatch(rolesUpdated(res.data.roles));
  } catch (e) {
    return Promise.reject(e);
  }
};

export const fetchUserData = () => async (dispatch) => {
  try {
    const res = await userApi.get('/user/data');

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
      const newState = {
        slot: null,
        event: data
      };

      dispatch(eventAdded(data));
      dispatch(rbcSelectionUpdated(newState)); // set selection to newly created event
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/event/${data.id}`, data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(eventUpdated(data));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    userApi.delete(`/event/${id}`).then((res) => {
      const newState = {
        slot: getCurrentDateSlot(),
        event: null
      };

      dispatch(eventDeleted(res.data.id));
      dispatch(rbcSelectionUpdated(newState)); // Reset initial calendar slot
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
    const payload = _.omit(data, ['id']);
    const res = await userApi.put(`/calendar/${data.id}`, payload);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarUpdated(data));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteCalendar = (id) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/calendar/${id}`);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarDeleted(data.id));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/user`, data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(usernameUpdated(data.username));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(viewUpdated(view));
};

export const initCalendarUI = () => async (dispatch) => {
  try {
    // Set initial calendar slot
    const newState = {
      slot: getCurrentDateSlot(),
      event: null
    };

    dispatch(rbcSelectionUpdated(newState));
    dispatch(viewUpdated(defaultView));
  } catch (e) {
    return Promise.reject(e);
  }
};

// return serialized slot object with start/end spanning 24 hours starting at 12:00am
const getCurrentDateSlot = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    action: 'click',
    start: start.toISOString(),
    end: end.toISOString(),
    slots: [start.toISOString()]
  };
};
