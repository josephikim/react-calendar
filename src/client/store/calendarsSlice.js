import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';

export const initialState = {
  all: {}
};

const calendarsSlice = createSlice({
  name: 'calendars',
  initialState,
  reducers: {
    calendarsUpdated(state, action) {
      state.all = action.payload;
    },
    calendarAdded(state, action) {
      state.all = {
        ...state.all,
        [action.payload.id]: action.payload
      };
    },
    calendarUpdated(state, action) {
      state.all = {
        ...state.all,
        [action.payload.id]: action.payload
      };
    },
    calendarDeleted(state, action) {
      state.all = _.omit(state.all, [action.payload]);
    }
  }
});

export const { calendarsUpdated, calendarAdded, calendarUpdated, calendarDeleted } = calendarsSlice.actions;

export default calendarsSlice.reducer;

//
// Bound action creators
//

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
