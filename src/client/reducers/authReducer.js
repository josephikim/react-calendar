export const authReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        authenticatedUser: action.payload
      };
    default:
      return state;
  }
};