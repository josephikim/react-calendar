import _ from 'lodash';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }

    let json = JSON.parse(serializedState);
    let slot = json.app.rbcSelection.slot;
    let formValues = localStorage.getItem('formValues');

    // If app state's selection is a slot and form values are available, update slot
    if (slot && formValues) {
      json.app.rbcSelection.slot = updateSlotWithFormValues(slot, formValues);
    }

    return json;
  } catch (e) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    throw e;
  }
};

export const updateSlotWithFormValues = (slot, formValues) => {
  let json = JSON.parse(formValues);

  return {
    ...slot,
    start: json.start ?? slot.start,
    end: json.end ?? slot.end
  };
};
