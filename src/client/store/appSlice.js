import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getCurrentDaySlot } from 'client/utils/rbc';
import { defaultView } from 'config/appConfig';

export const initialState = {
  rbcSelection: {},
  rbcView: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    rbcSelectionUpdated(state, action) {
      state.rbcSelection = action.payload;
    },
    rbcViewUpdated(state, action) {
      state.rbcView = action.payload;
    }
  }
});

export const { rbcSelectionUpdated, rbcViewUpdated } = appSlice.actions;

export default appSlice.reducer;

// Takes entire redux state as input (not just a state slice)
const selectRbcSelection = (state) => state.app.rbcSelection;

//
// Memoized selectors
//

// returns times as Date objects
export const deserializedRbcSelectionSelector = createSelector([selectRbcSelection], (rbcSelection) => {
  const selectedSlot = rbcSelection.slot;
  const selectedEvent = rbcSelection.event;

  const deserializedSlot = selectedSlot
    ? {
        ...selectedSlot,
        start: new Date(selectedSlot.start),
        end: new Date(selectedSlot.end),
        slots: selectedSlot.slots.map((slot) => new Date(slot))
      }
    : null;

  const deserializedEvent = selectedEvent
    ? { ...selectedEvent, start: new Date(selectedEvent.start), end: new Date(selectedEvent.end) }
    : null;

  const result = {
    slot: deserializedSlot,
    event: deserializedEvent
  };

  return result;
});

//
// Bound action creators
//

export const onSelectSlot = (serializedSlot) => (dispatch) => {
  const newState = {
    slot: serializedSlot,
    event: null
  };

  dispatch(rbcSelectionUpdated(newState));
};

export const onSelectEvent = (serializedEvent) => (dispatch) => {
  const newState = {
    slot: null,
    event: serializedEvent
  };

  dispatch(rbcSelectionUpdated(newState));
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(rbcViewUpdated(view));
};

export const initCalendar = () => (dispatch) => {
  // Set initial calendar slot
  const newState = {
    slot: getCurrentDaySlot(),
    event: null
  };

  dispatch(rbcSelectionUpdated(newState));
  dispatch(rbcViewUpdated(defaultView));
};
