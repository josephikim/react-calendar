export const eventReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_SELECT_SLOT":
      return {
        ...state,
        selectedSlot: action.selectedSlot
      };
    case "UPDATE_SELECT_EVENT":
      return {
        ...state,
        selectedEvent: action.selectedEvent
      };
    default:
      return state;
  }
};