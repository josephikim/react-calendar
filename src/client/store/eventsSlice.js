import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';
import { getCurrentDaySlot } from 'client/utils/rbc';
import { defaultView } from 'config/appConfig';

export const initialState = {
  all: {}
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    eventsUpdated(state, action) {
      // convert array of objects to POJO
      const newState = {};

      action.payload.forEach((element) => {
        newState[element.id] = element;
      });

      state.all = newState;
    },
    eventAdded(state, action) {
      state.all = {
        ...state.all,
        [action.payload.id]: action.payload
      };
    },
    eventUpdated(state, action) {
      state.all = {
        ...state.all,
        [action.payload.id]: action.payload
      };
    },
    eventDeleted(state, action) {
      state.all = _.omit(state.all, [action.payload]);
    }
  }
});

export const { eventsUpdated, eventAdded, eventDeleted, eventUpdated } = eventsSlice.actions;

export default eventsSlice.reducer;

const eventsSelector = (state) => state.events.all;

//
// Memoized selectors
//

// returns events with times as Date type
export const deserializedEventsSelector = createSelector([eventsSelector], (events) => {
  const newState = {};

  Object.keys(events).forEach((key) => {
    newState[key] = {
      ...events[key],
      start: new Date(events[key].start),
      end: new Date(events[key].end)
    };
  });

  return newState;
});

//
// Bound action creators
//

export const fetchEvents = () => async (dispatch) => {
  try {
    const res = await userApi.get('/event/all');

    return Promise.resolve(res.data).then((data) => {
      dispatch(eventsUpdated(data));
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
        slot: getCurrentDaySlot(),
        event: null
      };

      dispatch(eventDeleted(res.data.id));
      dispatch(rbcSelectionUpdated(newState)); // Reset initial calendar slot
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
