import { createSlice, createSelector } from '@reduxjs/toolkit';
import { calendarsUpdated } from './calendarsSlice';
import { userApi } from 'client/utils/axios';

export const initialState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  roles: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    usernameUpdated(state, action) {
      state.username = action.payload;
    },
    accessTokenUpdated(state, action) {
      state.accessToken = action.payload;
    },
    refreshTokenUpdated(state, action) {
      state.refreshToken = action.payload;
    },
    rolesUpdated(state, action) {
      state.roles = action.payload;
    }
  }
});

export const { usernameUpdated, accessTokenUpdated, refreshTokenUpdated, rolesUpdated } = userSlice.actions;

export default userSlice.reducer;

//
// Bound action creators
//

export const logoutUser = () => (dispatch) => {
  dispatch({
    type: 'user/userLoggedOut'
  });
};

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/user/login', data);

    dispatch(usernameUpdated(res.data.username));
    dispatch(accessTokenUpdated(res.data.accessToken));
    dispatch(refreshTokenUpdated(res.data.refreshToken));
    dispatch(rolesUpdated(res.data.roles));
    dispatch(calendarsUpdated(res.data.calendars));
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
    const res = await userApi.post('/user/register', data);

    dispatch(usernameUpdated(res.data.username));
    dispatch(accessTokenUpdated(res.data.accessToken));
    dispatch(refreshTokenUpdated(res.data.refreshToken));
    dispatch(rolesUpdated(res.data.roles));
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/user`, data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(usernameUpdated(data.username));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
