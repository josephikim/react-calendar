import axios from 'axios';
import store from '../store/createStore';

const userApi = axios.create({
  baseURL: `${process.env.API_URL}`
});

let headers = {
  'Content-Type': 'application/json'
}

userApi.interceptors.request.use(
  request => {
    const accessToken = store.getState().auth.accessToken;
    headers['x-access-token'] = accessToken;
    if(request.url.includes('test') || request.url.includes('event') || request.url.includes('user')) {
      request.headers = headers;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

export { userApi };