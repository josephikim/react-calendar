export const calendarReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_SELECTED_SLOT":
      return {
        ...state,
        selectedSlot: action.payload.selectedSlot
      };
    case "UPDATE_SELECTED_EVENT":
      return {
        ...state,
        selectedEvent: action.payload.selectedEvent
      };
    default:
      return state;
  }
};