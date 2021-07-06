import axios from 'axios';
import { batch } from 'react-redux'

export const onSelectSlot = (event => {
  return (dispatch) => {
    batch(() => {
      dispatch(updateSelectedSlot(event))
      dispatch(updateSelectedEvent({}))
    })
  }
})

export const onSelectEvent = (event => {
  return (dispatch) => {
    batch(() => {
      dispatch(updateSelectedEvent(event))
      dispatch(updateSelectedSlot({}))
    })
  }
})

export const updateSelectedSlot = (event) => {
  return {
    type: 'UPDATE_SELECTED_SLOT',
    payload: event
  }
}

export const updateSelectedEvent = (event) => {
  return {
    type: 'UPDATE_SELECTED_EVENT',
    payload: event
  }
}

export const retrieveEvents = () => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.API_URL}/api/user/event`)

    return Promise.resolve(res.data).then(res => {
      // use Date type on event dates
      const payload = res.data.map(element => {
        const event = {
          _id: element._id,
          title: element.title,
          desc: element.desc,
          start: new Date(element.start),
          end: new Date(element.end)
        }
        return event;
      })
      
      dispatch({
        type: 'RETRIEVE_EVENTS',
        payload: payload
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createEvent = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/user/event`, data)

    return Promise.resolve(res.data).then(res => {
      // convert dates to type Date
      res.data.start = new Date(res.data.start);
      res.data.end = new Date(res.data.end);

      batch(() => {
        dispatch({
          type: 'CREATE_EVENT',
          payload: res.data
        });
        dispatch({
          type: 'UPDATE_SELECTED_EVENT',
          payload: res.data
        });
        dispatch({
          type: 'UPDATE_SELECTED_SLOT',
          payload: {}
        });
      })
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/user/event/${eventId}/delete`)

    return Promise.resolve(res.data).then(res => {
      const deletedId = res.data._id;
      batch(() => {
        dispatch({
          type: 'DELETE_EVENT',
          payload: deletedId
        });
        dispatch({
          type: 'UPDATE_SELECTED_EVENT',
          payload: {}
        });
      })
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateEvent = (event) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/user/event/${event.id}/update`, event)

    return Promise.resolve(res.data).then(res => {
      // convert dates to type Date
      res.data.start = new Date(res.data.start);
      res.data.end = new Date(res.data.end);

      batch(() => {
        dispatch({
          type: 'UPDATE_EVENT',
          payload: res.data
        });
        dispatch({
          type: 'UPDATE_SELECTED_EVENT',
          payload: res.data
        });
      })
    });
  } catch (err) {
    return Promise.reject(err);
  }
}