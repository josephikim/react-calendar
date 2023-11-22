import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { onSelectSlot, onSelectEvent } from './appSlice';
import { userApi } from 'client/utils/axios';
import { getSmartDates } from 'client/utils/rbc';

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
    const tzOffset = new Date(events[eventId].start).getTimezoneOffset() * 60000; //offset in milliseconds

    let startDate = new Date(events[eventId].start);
    let endDate = new Date(events[eventId].end);

    // for UTC dates (ie system events), modify to account for time zone offset
    if (events[eventId].timeZone === 'Etc/UTC') {
      startDate = new Date(startDate.getTime() + tzOffset);
      endDate = new Date(endDate.getTime() + tzOffset);
    }

    return {
      ...events[eventId],
      start: startDate,
      end: endDate
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

    // clear local form values
    localStorage.removeItem('formValues');

    // Reset calendar slot
    let deletedEventStart = res.data.start;
    let smartDates = getSmartDates(new Date(deletedEventStart));

    dispatch(onSelectSlot({ start: smartDates.start.toISOString(), end: smartDates.end.toISOString() }));
  } catch (e) {
    throw e;
  }
};
