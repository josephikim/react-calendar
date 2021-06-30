import axios from 'axios';

export const createUser = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/user/create`, data)

    return Promise.resolve(res.data).then(res => {
      const createdUser = res.data;

      dispatch({
        type: 'UPDATE_USER',
        payload: createdUser
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};