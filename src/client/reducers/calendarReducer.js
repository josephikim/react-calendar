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
        events: action.payload
      };
    case "CREATE_EVENT":
      return {
        ...state,
        events: [
          ...state.events, 
          action.payload
        ]
      };
    case "DELETE_EVENT":
      return {
        ...state,
        events: [
          ...state.events.filter(element => element._id !== action.payload)
        ]
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) => event._id === action.payload._id ? action.payload : event)
      };
    default:
      return state;
  }
};