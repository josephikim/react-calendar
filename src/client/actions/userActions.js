import { batch } from 'react-redux';
import { userApi } from '../utils/axios';

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
        payload: res.data.username
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

// NOT AN ACTION
export const updatePassword = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/user/${data._id}/password/update`, data)

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}