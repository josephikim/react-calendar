import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { calendarsUpdated } from './calendarsSlice';
import { userApi } from 'client/utils/axios';
import { getCurrentDaySlot } from 'client/utils/rbc';
import { defaultView } from 'config/appConfig';

export const initialState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  roles: [],
  rbcSelection: {},
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
  rbcSelectionUpdated,
  viewUpdated
} = userSlice.actions;

export default userSlice.reducer;

// Takes entire redux state as input (not just a state slice)
const rbcSelectionSelector = (state) => state.user.rbcSelection;

//
// Memoized selectors
//

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
    dispatch(calendarsUpdated(res.data.calendars));
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
      slot: getCurrentDaySlot(),
      event: null
    };

    dispatch(rbcSelectionUpdated(newState));
    dispatch(viewUpdated(defaultView));
  } catch (e) {
    return Promise.reject(e);
  }
};
