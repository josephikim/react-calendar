export const authReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        authenticatedUser: action.payload
      };
    case 'UPDATE_LOADING_STATUS':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};