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
    calendarsUpdated(state, action) {
      // accepts array of objects
      const byId = {};
      const allIds = [];

      action.payload.forEach((element) => {
        byId[element.calendar.id] = {
          id: element.calendar.id,
          color: element.color,
          visibility: element.visibility,
          userDefault: element.userDefault,
          name: element.calendar.name,
          user_id: element.calendar.user_id
        };

        allIds.push(element.calendar.id);
      });

      state.byId = byId;
      state.allIds = allIds;
    },
    calendarAdded(state, action) {
      state.byId = {
        ...state.byId,
        [action.payload.id]: action.payload
      };
      state.allIds = [...state.allIds, action.payload.id];
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

export const { calendarsUpdated, calendarAdded, calendarUpdated, calendarDeleted } = calendarsSlice.actions;

export default calendarsSlice.reducer;

//
// Bound action creators
//

export const createCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/calendars', data);

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
    const res = await userApi.put(`/calendars/${data.id}`, payload);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarUpdated(data));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const deleteCalendar = (id) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/calendars/${id}`);

    return Promise.resolve(res.data).then((data) => {
      dispatch(calendarDeleted(data.id));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
