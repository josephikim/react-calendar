import axios from 'axios';

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/user/login`, data)

    return Promise.resolve(res.data).then(res => {
      const user = res.data.user;

      dispatch({
        type: 'UPDATE_USER',
        payload: user
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    await axios.post(`${process.env.API_URL}/api/user/register`, data)
  } catch (err) {
    return Promise.reject(err)
  }
};