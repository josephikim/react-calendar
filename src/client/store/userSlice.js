import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from '../utils/axios';
import { defaultView } from '../../server/config/appConfig';

const initialState = {
  username: null,
  calendars: [],
  calendarSlotSelection: {},
  calendarEventSelection: {},
  calendarEvents: [],
  calendarViewSelection: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    usernameUpdated(state, action) {
      state.username = action.payload;
    },
    calendarsUpdated(state, action) {
      state.calendars = [...action.payload];
    },
    calendarEventsUpdated(state, action) {
      state.calendarEvents = action.payload;
    },
    calendarEventAdded(state, action) {
      state.calendarEvents = [...state.calendarEvents, action.payload];
    },
    calendarEventUpdated(state, action) {
      state.calendarEvents = state.calendarEvents.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
    },
    calendarEventDeleted(state, action) {
      state.calendarEvents = state.calendarEvents.filter((event) => event.id !== action.payload);
    },
    calendarAdded(state, action) {
      state.calendars = [...state.calendars, action.payload];
    },
    calendarUpdated(state, action) {
      state.calendars = state.calendars.map((calendar) =>
        calendar.id === action.payload.id ? { ...calendar, ...action.payload } : calendar
      );
    },
    calendarDeleted(state, action) {
      state.calendars = state.calendars.filter((calendar) => calendar.id !== action.payload);
    },
    calendarSlotSelectionUpdated(state, action) {
      state.calendarSlotSelection = action.payload;
    },
    calendarEventSelectionUpdated(state, action) {
      state.calendarEventSelection = action.payload;
    },
    calendarViewUpdated(state, action) {
      state.calendarViewSelection = action.payload;
    }
  }
});

export const {
  usernameUpdated,
  calendarsUpdated,
  calendarAdded,
  calendarUpdated,
  calendarDeleted,
  calendarSlotSelectionUpdated,
  calendarEventSelectionUpdated,
  calendarEventsUpdated,
  calendarEventAdded,
  calendarEventDeleted,
  calendarEventUpdated,
  calendarViewUpdated
} = userSlice.actions;

export default userSlice.reducer;

//
// Memoized selectors
//

const calendarSlotSelector = (state) => state.user.calendarSlotSelection;
const calendarEventSelector = (state) => state.user.calendarEventSelection;
const calendarEventsSelector = (state) => state.user.calendarEvents;

export const calendarSelectionWithSlotAndEvent = createSelector(
  [calendarSlotSelector, calendarEventSelector],
  (calendarSlot, calendarEvent) => {
    const isCalendarSlotSelected = Object.keys(calendarSlot).length > 0;
    const isCalendarEventSelected = Object.keys(calendarEvent).length > 0;

    const updateCompleteWithNewSlot = isCalendarSlotSelected && !isCalendarEventSelected;
    const updateCompleteWithNewEvent = isCalendarEventSelected && !isCalendarSlotSelected;

    if (updateCompleteWithNewSlot || updateCompleteWithNewEvent) {
      let updateObj = {
        calendarSlot: calendarSlot,
        calendarEvent: calendarEvent
      };
      return updateObj;
    } else return null;
  }
);

export const calendarEventsWithDateObjects = createSelector([calendarEventsSelector], (calendarEvents) => {
  let clonedEvents = JSON.parse(JSON.stringify(calendarEvents));

  clonedEvents.forEach((event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
  });

  return clonedEvents;
});

//
// Bound action creators
//

export const retrieveUserData = (userId) => async (dispatch) => {
  try {
    const res = await userApi.get('/data', { params: { userId } });

    return Promise.resolve(res.data).then((res) => {
      dispatch(usernameUpdated(res.username));
      dispatch(calendarsUpdated(res.calendars));
      dispatch(calendarEventsUpdated(res.calendarEvents));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createCalendarEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/event', data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarEventAdded(res.data));
      dispatch(calendarEventSelectionUpdated(res.data));
      dispatch(calendarSlotSelectionUpdated({}));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCalendarEvent = (event) => async (dispatch) => {
  try {
    const res = await userApi.post(`/event/update`, event);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarEventUpdated(res.data));
      dispatch(calendarEventSelectionUpdated(res.data));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteCalendarEvent = (eventId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/event/${eventId}/delete`);

    return Promise.resolve(res.data).then((res) => {
      // set slot selection to current date
      let start = new Date();
      let end = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      end.setHours(end.getHours() + 2, 0, 0, 0);

      const slot = {
        action: 'click',
        start,
        end,
        slots: [start]
      };

      dispatch(calendarEventDeleted(res.data.id));
      dispatch(updateCalendarEventSelection({}));
      dispatch(updateCalendarSlotSelection(slot));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/calendar', data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarAdded(res.data));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCalendar = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/calendar/update`, data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarUpdated(res.data));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteCalendar = (calendarId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/calendar/${calendarId}/delete`);

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarDeleted(calendarId));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateUsername = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/account/username/update`, data);

    return Promise.resolve(res.data).then((res) => {
      dispatch(usernameUpdated(res.username));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCalendarSlotSelection = (slot) => async (dispatch) => {
  let clonedSlot = _.cloneDeep(slot);

  // Convert dates to strings
  if (!_.isEmpty(clonedSlot)) {
    clonedSlot.start = clonedSlot.start.toISOString();
    clonedSlot.end = clonedSlot.end.toISOString();
    clonedSlot.slots = clonedSlot.slots.map((slot) => {
      return slot.toISOString();
    });
  }

  dispatch(calendarSlotSelectionUpdated(clonedSlot));
};

export const updateCalendarEventSelection = (event) => async (dispatch) => {
  let clonedEvent = _.cloneDeep(event);

  // Convert dates to strings
  if (!_.isEmpty(clonedEvent)) {
    clonedEvent.start = clonedEvent.start.toISOString();
    clonedEvent.end = clonedEvent.end.toISOString();
  }

  dispatch(calendarEventSelectionUpdated(clonedEvent));
};

export const onSelectSlot = (slot) => (dispatch) => {
  return Promise.all([dispatch(updateCalendarSlotSelection(slot)), dispatch(updateCalendarEventSelection({}))]);
};

export const onSelectEvent = (event) => (dispatch) => {
  return Promise.all([dispatch(updateCalendarEventSelection(event)), dispatch(updateCalendarSlotSelection({}))]);
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(calendarViewUpdated(view));
};

export const initializeCalendarView = () => async (dispatch) => {
  try {
    // Initial calendar slot
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

    return Promise.all([
      dispatch(updateCalendarSlotSelection(initialSlot)),
      dispatch(updateCalendarEventSelection({})),
      dispatch(onSelectView(defaultView))
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

// NOT AN ACTION
export const updatePassword = (data) => async () => {
  try {
    const res = await userApi.post(`/account/password/update`, data);

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
