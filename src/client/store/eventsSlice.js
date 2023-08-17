import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { onSelectSlot, onSelectEvent } from './appSlice';
import { userApi } from 'client/utils/axios';
import { getCurrentDaySlot } from 'client/utils/rbc';

export const initialState = {
  byId: {},
  allIds: []
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // accepts array of objects as payload
    eventsUpdated(state, action) {
      const byId = {};
      const allIds = [];

      action.payload.forEach((element) => {
        byId[element.id] = element;
        allIds.push(element.id);
      });

      state.byId = byId;
      state.allIds = allIds;
    },
    // accepts object as payload
    eventAdded(state, action) {
      state.byId = {
        ...state.byId,
        [action.payload.id]: action.payload
      };
      state.allIds = [...state.allIds, action.payload.id];
    },
    // accepts object as payload
    eventUpdated(state, action) {
      state.byId = {
        ...state.byId,
        [action.payload.id]: action.payload
      };
    },
    eventDeleted(state, action) {
      state.byId = _.omit(state.byId, [action.payload]);
      state.allIds = state.allIds.filter((id) => id !== action.payload);
    }
  }
});

export const { eventsUpdated, eventAdded, eventUpdated, eventDeleted } = eventsSlice.actions;

export default eventsSlice.reducer;

const selectEvents = (state) => state.events.byId;
const selectEventIds = (state) => state.events.allIds;

//
// Memoized selectors
//

// returns array of events with start/end as Date type
export const rbcEventsSelector = createSelector([selectEvents, selectEventIds], (events, eventIds) => {
  return eventIds.map((eventId) => {
    return {
      ...events[eventId],
      start: new Date(events[eventId].start),
      end: new Date(events[eventId].end)
    };
  });
});

//
// Bound action creators
//

export const getUserEvents = () => async (dispatch) => {
  try {
    const res = await userApi.get('/events/user');

    dispatch(eventsUpdated(res.data));
  } catch (e) {
    throw e;
  }
};

export const createEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/events', data);

    dispatch(eventAdded(res.data));

    // set selection to created event
    dispatch(onSelectEvent(res.data));
  } catch (e) {
    throw e;
  }
};

export const updateEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/events/${data.id}`, data);

    dispatch(eventUpdated(res.data));

    // set selection to updated event
    dispatch(onSelectEvent(res.data));
  } catch (e) {
    throw e;
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/events/${eventId}`);

    dispatch(eventDeleted(res.data.id));

    // Reset calendar slot
    dispatch(onSelectSlot(getCurrentDaySlot()));
  } catch (e) {
    throw e;
  }
};
