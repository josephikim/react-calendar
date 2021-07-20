export const authReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload
      };
    case 'UPDATE_USERNAME':
      return {
        ...state,
        username: action.payload
      };
    case 'UPDATE_USER_ID':
      return {
        ...state,
        userId: action.payload
      };
    default:
      return state;
  }
};