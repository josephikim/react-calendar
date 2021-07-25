import axios from 'axios';

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/auth/login`, data);
    
    return Promise.resolve(res.data).then(res => {
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;
      const username = res.username;
      const id = res.id;
      
      // Update state
      dispatch({
        type: 'UPDATE_ACCESS_TOKEN',
        payload: accessToken
      });

      dispatch({
        type: 'UPDATE_REFRESH_TOKEN',
        payload: refreshToken
      });

      dispatch({
        type: 'UPDATE_USERNAME',
        payload: username
      });

      dispatch({
        type: 'UPDATE_USER_ID',
        payload: id
      });
    });
  } catch (err) {
    return Promise.reject(err.response.data);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/auth/register`, data);

    return Promise.resolve(res.data).then(res => {
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;
      const username = res.username;
      const id = res.id;
      
      // Update state
      dispatch({
        type: 'UPDATE_ACCESS_TOKEN',
        payload: accessToken
      });

      dispatch({
        type: 'UPDATE_REFRESH_TOKEN',
        payload: refreshToken
      });

      dispatch({
        type: 'UPDATE_USERNAME',
        payload: username
      });

      dispatch({
        type: 'UPDATE_USER_ID',
        payload: id
      });
    });
  } catch (err) {
    return Promise.reject(err.response.data);
  }
};