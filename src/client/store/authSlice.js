import { createSlice } from '@reduxjs/toolkit';
import { userApi } from 'client/utils/axios';

export const initialState = {
  accessToken: null,
  refreshToken: null,
  userId: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    accessTokenUpdated(state, action) {
      state.accessToken = action.payload;
    },
    refreshTokenUpdated(state, action) {
      state.refreshToken = action.payload;
    },
    userIdUpdated(state, action) {
      state.userId = action.payload;
    }
  }
});

export const { accessTokenUpdated, refreshTokenUpdated, userIdUpdated } = authSlice.actions;

export default authSlice.reducer;

export const logoutUser = () => (dispatch) => {
  dispatch({
    type: 'auth/userLoggedOut'
  });
};

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/login', data);

    return Promise.resolve(res.data).then((res) => {
      const userId = res.id;
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      dispatch(userIdUpdated(userId));
      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
    });
  } catch (e) {
    if (e.response && e.response.data.name === 'AuthorizationError') {
      // unauthorize user
      dispatch(accessTokenUpdated(null));
    }
    return Promise.reject(e);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/register', data);

    return Promise.resolve(res.data).then((res) => {
      const userId = res.id;
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      dispatch(userIdUpdated(userId));
      dispatch(accessTokenUpdated(accessToken));
      dispatch(refreshTokenUpdated(refreshToken));
    });
  } catch (e) {
    return Promise.reject(e.response);
  }
};
