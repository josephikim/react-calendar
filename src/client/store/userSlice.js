import _ from 'lodash';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { userApi } from '../utils/axios';

const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    usernameUpdated(state, action) {
      state.username = action.payload;
    },
    userIdUpdated(state, action) {
      state.userId = action.payload;
    },
    allCalendarsUpdated(state, action) {
      state.calendars = [...action.payload];
    },
    calendarAdded(state, action) {
      state.calendars = [...state.calendars, action.payload];
    },
    calendarUpdated(state, action) {
      state.calendars = state.calendars.map((calendar) =>
        calendar.id === action.payload.id ? { ...calendar, ...action.payload } : calendar
      );
    },
    calendarSlotSelectionUpdated(state, action) {
      state.calendarSlotSelection = action.payload;
    },
    calendarEventSelectionUpdated(state, action) {
      state.calendarEventSelection = action.payload;
    },
    calendarEventsUpdated(state, action) {
      state.calendarEvents = action.payload;
    },
    calendarEventAdded(state, action) {
      state.calendarEvents = [...state.calendarEvents, action.payload];
    },
    calendarEventDeleted(state, action) {
      state.calendarEvents = state.calendarEvents.filter((event) => event.id !== action.payload);
    },
    calendarEventUpdated(state, action) {
      state.calendarEvents = state.calendarEvents.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
    },
    calendarViewUpdated(state, action) {
      state.calendarViewSelection = action.payload;
    }
  }
});

export const {
  usernameUpdated,
  userIdUpdated,
  allCalendarsUpdated,
  calendarAdded,
  calendarUpdated,
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

export const calendarSelectionWithSlotAndEvent = createSelector(
  [calendarSlotSelector, calendarEventSelector],
  (calendarSlot, calendarEvent) => {
    const isCalendarSlotSelected = Object.keys(calendarSlot).length > 0;
    const isCalendarEventSelected = Object.keys(calendarEvent).length > 0;

    const updateCompleteWithNewSlot = isCalendarSlotSelected && !isCalendarEventSelected;
    const updateCompleteWithNewEvent = isCalendarEventSelected && !isCalendarSlotSelected;

    if (updateCompleteWithNewSlot || updateCompleteWithNewEvent) {
      let updateObj = {
        calendarSlotSelection: calendarSlot,
        calendarEventSelection: calendarEvent
      };
      return updateObj;
    } else return null;
  }
);

const calendarEventsSelector = (state) => state.user.calendarEvents;

export const calendarEventsWithDateObjects = createSelector([calendarEventsSelector], (calendarEvents) => {
  let eventsCloned = JSON.parse(JSON.stringify(calendarEvents));

  eventsCloned.forEach((event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
  });

  return eventsCloned;
});

//
// Bound action creators
//

export const initializeCalendarData = (userId) => (dispatch) => {
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

  return Promise.all([
    dispatch(retrieveCalendarEvents(userId)),
    dispatch(updateCalendarEventSelection({})),
    dispatch(updateCalendarSlotSelection(initialSlot))
  ]);
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

export const retrieveCalendarEvents = (userId) => async (dispatch) => {
  if (!userId) return;

  try {
    const res = await userApi.get('/event', { params: { userId: userId } });

    return Promise.resolve(res.data).then((res) => {
      dispatch(calendarEventsUpdated(res.data));
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

// NOT AN ACTION
export const updatePassword = (data) => async () => {
  try {
    const res = await userApi.post(`/account/password/update`, data);

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
