export const configReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_LOGIN":
      return {
          ...state, 
          login: action.login
      };
    case "UPDATE_DATA_SOURCES":
      return {
          ...state, 
          sources: action.sources
      };
    default:
      return state;
  }
};