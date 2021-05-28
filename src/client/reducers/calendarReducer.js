export const calendarReducer = (state = [], action) => {  
  switch (action.type) {
    case "UPDATE_SELECTED_SLOT":
      return {
        ...state,
        selectedSlot: action.payload
      };
    case "UPDATE_SELECTED_EVENT":
      return {
        ...state,
        selectedEvent: action.payload
      };
    case "RETRIEVE_EVENTS":
      return {
        ...state,
        events: [action.payload]
      };
    case "CREATE_EVENT":
      return {
        ...state,
        newEvent: action.payload
      };
    default:
      return state;
  }
};