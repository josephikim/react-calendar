export const configReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_LOGIN":
      return {
          ...state, 
          login: action.login
      };
    case "UPDATE_CALENDARS":
      return {
          ...state, 
          calendars: action.calendars
      };
    default:
      return state;
  }
};