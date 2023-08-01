import { createSlice } from '@reduxjs/toolkit';
import { calendarsUpdated } from './calendarsSlice';
import { eventsUpdated } from './eventsSlice';
import { userApi } from 'client/utils/axios';

export const initialState = {
  id: 'guest',
  username: null,
  accessToken: null,
  refreshToken: null,
  roles: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    idUpdated(state, action) {
      state.id = action.payload;
    },
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
      state.roles = action.payload.map((item) => item.name);
    }
  }
});

export const { idUpdated, usernameUpdated, accessTokenUpdated, refreshTokenUpdated, rolesUpdated } = userSlice.actions;

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
    const res = await userApi.post('/users/login', data);

    dispatch(idUpdated(res.data.user.id));
    dispatch(usernameUpdated(res.data.user.username));
    dispatch(rolesUpdated(res.data.user.roles));
    dispatch(calendarsUpdated(res.data.user.calendarSettings));
    dispatch(accessTokenUpdated(res.data.accessToken));
    dispatch(refreshTokenUpdated(res.data.refreshToken));
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
    const res = await userApi.post('/users/register', data);

    dispatch(idUpdated(res.data.user.id));
    dispatch(usernameUpdated(res.data.user.username));
    dispatch(rolesUpdated(res.data.user.roles));
    dispatch(calendarsUpdated(res.data.user.calendarSettings));
    dispatch(accessTokenUpdated(res.data.accessToken));
    dispatch(refreshTokenUpdated(res.data.refreshToken));
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateUser = (data) => async (dispatch) => {
  try {
    const res = await userApi.put(`/users`, data);

    return Promise.resolve(res.data).then((data) => {
      dispatch(usernameUpdated(data.username));
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
