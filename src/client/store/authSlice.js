import { createSlice } from '@reduxjs/toolkit';
import {
  allCalendarsUpdated,
  usernameUpdated,
  calendarEventsUpdated,
  updateCalendarEventSelection,
  updateCalendarSlotSelection
} from './userSlice';
import { authApi } from '../utils/axios';

const authSlice = createSlice({
  name: 'auth',
  initialState: [],
  reducers: {
    accessTokenUpdated(state, action) {
      state.accessToken = action.payload;
    },
    refreshTokenUpdated(state, action) {
      state.refreshToken = action.payload;
    },
    userIdUpdated(state, action) {
      state.userId = action.payload;
    },
    userLoggedOut(state) {
      state.accessToken = null;
    }
  }
});

export const { accessTokenUpdated, refreshTokenUpdated, userIdUpdated, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;

export const logoutUser = () => (dispatch) => {
  localStorage.clear();

  dispatch(userLoggedOut());
};

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await authApi.post('/login', data);

    return Promise.resolve(res.data).then((res) => {
      const userId = res.id;
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;
      const username = res.username;
      const calendars = res.calendars;
      const events = res.calendarEvents;

      // Set initial calendar slot
      let start = new Date();
      let end = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      end.setHours(end.getHours() + 2, 0, 0, 0);

      const initialSlot = {
        action: 'click',
        start,
        end,
        slots: [start]
      };

      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
      dispatch(userIdUpdated(userId));
      dispatch(usernameUpdated(username));
      dispatch(allCalendarsUpdated(calendars));
      dispatch(calendarEventsUpdated(events));
      dispatch(updateCalendarEventSelection({}));
      dispatch(updateCalendarSlotSelection(initialSlot));
    });
  } catch (err) {
    if (err.response.data.name === 'AuthorizationError') {
      // unauthorize user
      dispatch(accessTokenUpdated(null));
    }
    return Promise.reject(err.response.data);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const res = await authApi.post('/register', data);

    return Promise.resolve(res.data).then((res) => {
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;
      const userId = res.id;

      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
      dispatch(userIdUpdated(userId));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
