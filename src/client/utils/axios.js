import axios from 'axios';
import store from '../store/createStore';
import { accessTokenUpdated } from '../store/authSlice';

const authApi = axios.create({
  baseURL: `${process.env.API_URL}` + '/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

const userApi = axios.create({
  baseURL: `${process.env.API_URL}` + '/user',
  headers: {
    'Content-Type': 'application/json'
  }
});

userApi.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await refreshToken();
          const { accessToken } = rs.data;

          userApi.defaults.headers.common['x-access-token'] = accessToken;

          // authorize user
          store.dispatch(accessTokenUpdated(accessToken));

          return userApi(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);

const getLocalAccessToken = () => {
  const accessToken = store.getState().auth.accessToken;
  return accessToken;
};

const getLocalRefreshToken = () => {
  const refreshToken = store.getState().auth.refreshToken;
  return refreshToken;
};

const refreshToken = () => {
  return authApi.post('/refreshtoken', {
    refreshToken: getLocalRefreshToken()
  });
};

export { authApi, userApi };
