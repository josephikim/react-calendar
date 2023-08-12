import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';

export const initialState = {
  byId: {},
  allIds: []
};

const calendarsSlice = createSlice({
  name: 'calendars',
  initialState,
  reducers: {
    // accepts array of objects as payload
    calendarsUpdated(state, action) {
      const byId = {};
      const allIds = [];

      action.payload.forEach((element) => {
        byId[element.id] = {
          ...state.byId[element.id],
          ...element
        };

        allIds.push(element.id);
      });

      state.byId = byId;
      state.allIds = allIds;
    },
    calendarUpdated(state, action) {
      state.byId = {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          ...action.payload
        }
      };
    },
    calendarDeleted(state, action) {
      state.byId = _.omit(state.byId, [action.payload]);
      state.allIds = state.allIds.filter((id) => id !== action.payload);
    }
  }
});

export const { calendarsUpdated, calendarUpdated, calendarDeleted } = calendarsSlice.actions;

export default calendarsSlice.reducer;

//
// Bound action creators
//

export const createCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/calendars', data);

    dispatch(calendarsUpdated(res.data));
  } catch (e) {
    throw e;
  }
};

export const updateCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/calendars/${data.id}`, data);

    dispatch(calendarUpdated(res.data));
  } catch (e) {
    throw e;
  }
};

export const updateCalendarSettings = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/calendars/${data.id}/settings`, data);

    dispatch(calendarsUpdated(res.data));
  } catch (e) {
    throw e;
  }
};

export const deleteCalendar = (id) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/calendars/${id}`);

    dispatch(calendarDeleted(res.data.id));
  } catch (e) {
    throw e;
  }
};
