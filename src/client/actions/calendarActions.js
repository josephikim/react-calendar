import axios from 'axios';

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
      dispatch({
        type: 'RETRIEVE_EVENTS',
        payload: res.data
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
      dispatch({
        type: 'CREATE_EVENT',
        payload: res.data
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

// export const updateEvent = event => {
//   const accessString = window.localStorage.getItem('JWT')
//   if (accessString) {
//     // Make API call for all events
//     axios
//       .get(`${process.env.API_URL}/event`, {
//         headers: { Authorization: `JWT ${accessString}` },
//       })
//       .then(res => {
//         // loop through res data, for each entry, change startdate and enddate to date object - because api endpoint is returning JSON (all strings)
//         res.data.forEach(function (arrayItem) {
//           arrayItem.start = new Date(arrayItem.start)
//           arrayItem.end = new Date(arrayItem.end)
//           nextState.events.push(arrayItem)
//         })
//         // Update state
//         this.setState({ ...nextState })
//       })
//   }
// }
// renderDelete = () => {
//   let nextState = this.state
//   // Update next state
//   nextState.formValues.id = ''
//   nextState.formValues.title = ''
//   nextState.formValues.desc = ''
//   nextState.formValues.start = {}
//   nextState.formValues.end = {}
//   nextState.formValues.allDay = true
//   nextState.events = []
//   // API call
//   const accessString = window.localStorage.getItem('JWT')
//   if (accessString) {
//     // Make API call for all events
//     axios
//       .get(`${process.env.API_URL}/event`, {
//         headers: { Authorization: `JWT ${accessString}` },
//       })
//       .then(res => {
//         // loop through res data, for each entry, change startdate and enddate to date object - because api endpoint is returning JSON (all strings)
//         res.data.forEach(function (arrayItem) {
//           arrayItem.start = new Date(arrayItem.start)
//           arrayItem.end = new Date(arrayItem.end)
//           nextState.events.push(arrayItem)
//         })
//         // Update state
//         this.setState({ ...nextState })
//       })
//   }
// }