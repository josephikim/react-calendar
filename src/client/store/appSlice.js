import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getCurrentDaySlot } from 'client/utils/rbc';
import { defaultView } from 'config/appConfig';
import { addToLocalStorageObject } from 'client/utils/localStorage';

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

  localStorage.removeItem('formValues');
};

export const onSelectView = (view) => (dispatch) => {
  dispatch(rbcViewUpdated(view));
};

export const initCalendar = () => (dispatch) => {
  const currentDaySlot = getCurrentDaySlot();
  const localFormValues = localStorage.getItem('formValues');

  if (localFormValues) {
    const json = JSON.parse(localFormValues);

    const initialSlot = {
      action: 'click',
      start: json.start ?? currentDaySlot.start,
      end: json.end ?? currentDaySlot.end,
      slots: [json.start ?? currentDaySlot.start]
    };

    dispatch(
      rbcSelectionUpdated({
        slot: initialSlot,
        event: null
      })
    );
  } else {
    dispatch(
      rbcSelectionUpdated({
        slot: currentDaySlot,
        event: null
      })
    );
  }
  dispatch(rbcViewUpdated(defaultView));
};
