export const authReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload
      };
    default:
      return state;
  }
};