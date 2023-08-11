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

// State selectors
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

  return {
    slot: deserializedSlot,
    event: deserializedEvent
  };
});

//
// Bound action creators
//

export const onSelectSlot = (serializedSlot) => (dispatch) => {
  dispatch(
    rbcSelectionUpdated({
      slot: serializedSlot,
      event: null
    })
  );
};

export const onSelectEvent = (serializedEvent) => (dispatch) => {
  dispatch(
    rbcSelectionUpdated({
      slot: null,
      event: serializedEvent
    })
  );
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(rbcViewUpdated(view));
};

export const initCalendar = () => (dispatch) => {
  dispatch(rbcViewUpdated(defaultView));

  // Set initial calendar slot
  dispatch(
    rbcSelectionUpdated({
      slot: getCurrentDaySlot(),
      event: null
    })
  );
};
