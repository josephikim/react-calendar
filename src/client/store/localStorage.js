import _ from 'lodash';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }

    const json = JSON.parse(serializedState);

    const jsonWithUpdatedSlot = updateRbcSlotWithFormValues(json);

    return jsonWithUpdatedSlot;
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

// Check local storage for saved form values
// If exists, return json with updated rbc slot
export const updateRbcSlotWithFormValues = (json) => {
  // If last rbc selection was an event, don't update json
  if (json.app.rbcSelection.event) return json;

  const localFormValues = localStorage.getItem('formValues');

  if (localFormValues) {
    const localFormValuesJson = JSON.parse(localFormValues);

    const updatedSlot = {
      ...json.app.rbcSelection.slot,
      start: localFormValuesJson.start ?? json.app.rbcSelection.slot.start,
      end: localFormValuesJson.end ?? json.app.rbcSelection.slot.end
      // slots: [json.start ?? json.app.rbcSelection.slot.slots]
    };

    const updatedJson = {
      ...json,
      app: {
        ...json.app,
        rbcSelection: {
          ...json.app.rbcSelection,
          slot: updatedSlot
        }
      }
    };

    return updatedJson;
  }

  return json;
};
