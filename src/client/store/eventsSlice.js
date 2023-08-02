import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
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
    eventsUpdated(state, action) {
      const byId = {}; // convert array of objects to POJO
      const allIds = [];

      action.payload.forEach((element) => {
        byId[element.id] = element;
        allIds.push(element.id);
      });

      state.byId = byId;
      state.allIds = allIds;
    },
    eventAdded(state, action) {
      state.byId = {
        ...state.byId,
        [action.payload.id]: action.payload
      };
      state.allIds = [...state.allIds, action.payload.id];
    },
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
  const result = eventIds.map((eventId) => {
    return {
      ...events[eventId],
      start: new Date(events[eventId].start),
      end: new Date(events[eventId].end)
    };
  });

  return result;
});

//
// Bound action creators
//

export const getEvents = () => async (dispatch) => {
  try {
    const res = await userApi.get('/events');

    dispatch(eventsUpdated(res.data));
  } catch (e) {
    throw e;
  }
};

export const createEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/events', data);

    const newState = {
      slot: null,
      event: res.data
    };

    dispatch(eventAdded(res.data));
    dispatch(rbcSelectionUpdated(newState)); // set selection to newly created event
  } catch (e) {
    throw e;
  }
};

export const updateEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/events/${data.id}`, data);

    dispatch(eventUpdated(res.data));
  } catch (e) {
    throw e;
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/events/${id}`);

    const newState = {
      slot: getCurrentDaySlot(),
      event: null
    };

    dispatch(eventDeleted(res.data.id));
    dispatch(rbcSelectionUpdated(newState)); // Reset initial calendar slot
  } catch (e) {
    throw e;
  }
};
