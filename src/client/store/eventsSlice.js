import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { rbcSelectionUpdated } from './appSlice';
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

    // set selection to newly created event
    dispatch(
      rbcSelectionUpdated({
        slot: null,
        event: res.data
      })
    );
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

    dispatch(eventDeleted(res.data.id));

    // Reset initial calendar slot
    dispatch(
      rbcSelectionUpdated({
        slot: getCurrentDaySlot(),
        event: null
      })
    );
  } catch (e) {
    throw e;
  }
};
