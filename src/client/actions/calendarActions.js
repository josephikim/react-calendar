import axios from 'axios';

export const onSelectSlot = (event => {
  return (dispatch) => {
    dispatch(updateSelectedSlot(event))
    dispatch(updateSelectedEvent({}))
  }
})

export const onSelectEvent = (event => {
  return (dispatch) => {
    dispatch(updateSelectedEvent(event))
    dispatch(updateSelectedSlot({}))
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
    const res = await axios.get(`${process.env.API_URL}/api/calendar/event`)
    
    return Promise.resolve(res.data).then(res => {      
      // use Date type on event dates
      const payload = res.data.map(element => {
        const event = {
          _id: element._id,
          title: element.title,
          desc: element.desc,        
          startDate: new Date(element.startDate),
          endDate: new Date(element.endDate)
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
    const res = await axios.post(`${process.env.API_URL}/api/calendar/event`, data)
    
    return Promise.resolve(res.data).then(res => {
      // convert dates to type Date
      res.data.startDate = new Date(res.data.startDate);
      res.data.endDate = new Date(res.data.endDate);

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
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/calendar/event/${eventId}/delete`)
  
    return Promise.resolve(res.data).then(res => {
      dispatch({
        type: 'DELETE_EVENT',
        payload: res.data._id
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateEvent = (event) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.API_URL}/api/calendar/event/${event.id}/update`, event)

    return Promise.resolve(res.data).then(res => {
      // convert dates to type Date
      res.data.startDate = new Date(res.data.startDate);
      res.data.endDate = new Date(res.data.endDate);

      dispatch({
        type: 'UPDATE_EVENT',
        payload: res.data
      });
      dispatch({
        type: 'UPDATE_SELECTED_EVENT',
        payload: res.data
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
}