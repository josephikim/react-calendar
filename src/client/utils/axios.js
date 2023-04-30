import axios from 'axios';
import store from 'client/store/createStore';
import { accessTokenUpdated } from 'client/store/authSlice';

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
  (e) => {
    return Promise.reject(e);
  }
);

userApi.interceptors.response.use(
  (res) => {
    return res;
  },
  async (e) => {
    const originalConfig = e.config;

    if (e.response) {
      // Access Token was expired
      if (e.response.status === 401 && !originalConfig._retry) {
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

      if (e.response.status === 403) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(e);
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
  return userApi.post('/refreshtoken', {
    refreshToken: getLocalRefreshToken()
  });
};

export { userApi };
