import { authApi } from "../utils/axios";

export const loginUser = (data) => async (dispatch) => {
  try {
    const res = await authApi.post("/login", data);

    return Promise.resolve(res.data).then((res) => {
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;
      const username = res.username;
      const id = res.id;
      const calendars = res.calendars;

      // Update state
      dispatch({
        type: "UPDATE_ACCESS_TOKEN",
        payload: accessToken,
      });

      dispatch({
        type: "UPDATE_REFRESH_TOKEN",
        payload: refreshToken,
      });

      dispatch({
        type: "UPDATE_USERNAME",
        payload: username,
      });

      dispatch({
        type: "UPDATE_USER_ID",
        payload: id,
      });

      dispatch({
        type: "CREATE_CALENDAR",
        payload: calendars,
      });
    });
  } catch (err) {
    if (err.response.data.name === "AuthorizationError") {
      // unauthorize user
      dispatch({
        type: "UPDATE_ACCESS_TOKEN",
        payload: null,
      });
    }
    return Promise.reject(err.response.data);
  }
};

export const registerUser = (data) => async (dispatch) => {
  try {
    const res = await authApi.post("/register", data);

    return Promise.resolve(res.data).then((res) => {
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;
      const username = res.username;
      const id = res.id;
      const calendars = res.calendars;

      // Update state
      dispatch({
        type: "UPDATE_ACCESS_TOKEN",
        payload: accessToken,
      });

      dispatch({
        type: "UPDATE_REFRESH_TOKEN",
        payload: refreshToken,
      });

      dispatch({
        type: "UPDATE_USERNAME",
        payload: username,
      });

      dispatch({
        type: "UPDATE_USER_ID",
        payload: id,
      });

      dispatch({
        type: "CREATE_CALENDAR",
        payload: calendars,
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
