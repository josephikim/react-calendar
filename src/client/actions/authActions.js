import axios from 'axios';

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/auth/login`, data);

    return Promise.resolve(res.data).then(res => {
      const user = res.data.user;

      dispatch({
        type: 'UPDATE_USER',
        payload: user
      });
    });
  } catch (err) {
    return Promise.reject(err.response.data);
  }
};

// NOT AN ACTION
export const registerUser = (data) => async () => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/auth/register`, data);

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err.response.data);
  }
};