import { batch } from 'react-redux';
import { userApi } from '../utils/axios';
import _ from 'lodash';

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
  let payload = event;
  
  // Convert dates to strings
  if (!_.isEmpty(payload)) {
    payload.start = payload.start.toISOString();
    payload.end = payload.end.toISOString();
    payload.slots = payload.slots.map(slot => {
      return slot.toISOString();
    });
  }

  return {
    type: 'UPDATE_SELECTED_SLOT',
    payload
  }
}

export const updateSelectedEvent = (event) => {
  let payload = event;
  
   // Convert dates to strings
  if (!_.isEmpty(payload)) {
    payload.start = payload.start.toISOString();
    payload.end = payload.end.toISOString();
  }

  return {
    type: 'UPDATE_SELECTED_EVENT',
    payload
  }
}

export const retrieveEvents = () => async (dispatch) => {
  try {
    const res = await userApi.get('/event')

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
    const res = await userApi.post('/event', data)

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
    const res = await userApi.delete(`/event/${eventId}/delete`)

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
    const res = await userApi.post(`/event/${event.id}/update`, event)

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

export const updateUsername = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/user/${data._id}/username/update`, data)

    return Promise.resolve(res.data).then(res => {
      dispatch({
        type: 'UPDATE_USERNAME',
        payload: res.username
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

// NOT AN ACTION
export const updatePassword = (data) => async () => {
  try {
    const res = await userApi.post(`/user/${data._id}/password/update`, data)

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}