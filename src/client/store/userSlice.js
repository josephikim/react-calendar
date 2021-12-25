import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
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
      state.calendars = [...state.calendars, ...action.payload];
    },
    calendarUpdated(state, action) {
      state.calendars = state.calendars.map((calendar) =>
        calendar._id === action.payload._id ? action.payload : calendar
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
      state.calendarEvents = state.calendarEvents.filter((element) => element._id !== action.payload);
    },
    calendarEventUpdated(state, action) {
      state.calendarEvents = state.calendarEvents.map((event) =>
        event._id === action.payload._id ? action.payload : event
      );
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
  calendarEventUpdated
} = userSlice.actions;

export default userSlice.reducer;

export const onSelectSlot = (slot) => {
  this.updateCalendarSlotSelection(slot);
  this.updateCalendarEventSelection({});
};

export const onSelectEvent = (event) => {
  this.updateCalendarEventSelection(event);
  this.updateCalendarSlotSelection({});
};

export const updateCalendarSlotSelection = (slot) => async (dispatch) => {
  let newSlot = slot;

  // Convert dates to strings
  if (!_.isEmpty(newSlot)) {
    newSlot.start = newSlot.start.toISOString();
    newSlot.end = newSlot.end.toISOString();
    newSlot.slots = newSlot.slots.map((slot) => {
      return slot.toISOString();
    });
  }

  dispatch(calendarSlotSelectionUpdated(newSlot));
};

export const updateCalendarEventSelection = (event) => async (dispatch) => {
  dispatch(calendarEventSelectionUpdated(event));
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
    const res = await userApi.post(`/calendar/${data._id}/update`, data);

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
      dispatch(calendarEventDeleted(res.data._id));
      dispatch(calendarEventSelectionUpdated({}));

      // reset slot selection to current date
      let start = new Date();
      let end = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0);
      end.setHours(end.getHours() + 2, 0, 0, 0);

      const currentDateSlot = {
        action: 'click',
        start: start.toISOString(),
        end: end.toISOString()
      };

      dispatch(calendarSlotSelectionUpdated(currentDateSlot));
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateCalendarEvent = (event) => async (dispatch) => {
  try {
    const res = await userApi.post(`/event/${event.id}/update`, event);

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
    const res = await userApi.post(`/account/${data._id}/username/update`, data);

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
    const res = await userApi.post(`/account/${data._id}/password/update`, data);

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

// Export a reusable selector here
// export const selectTodos = state => state.todos