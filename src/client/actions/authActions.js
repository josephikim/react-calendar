import axios from 'axios';

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/auth/login`, data);
    
    return Promise.resolve(res.data).then(res => {
      const token = res.accessToken;
      const username = res.username;
      const userId = res.userId;
      
      // Update state
      dispatch({
        type: 'UPDATE_ACCESS_TOKEN',
        payload: token
      });

      dispatch({
        type: 'UPDATE_USERNAME',
        payload: username
      });

      dispatch({
        type: 'UPDATE_USER_ID',
        payload: userId
      });
    });
  } catch (err) {
    return Promise.reject(err.response.data);
  }
};

// NOT AN ACTION
export const registerUser = (data) => async () => {
  try {
    const res = await axios.post(`${process.env.API_URL}/auth/register`, data);

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err.response.data);
  }
};