export const configReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return {
          ...state, 
          user: action.payload
      };
    case "UPDATE_CALENDARS":
      return {
          ...state, 
          calendars: action.payload
      };
    default:
      return state;
  }
};