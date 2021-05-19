export const updateSelectedSlot = (event) => {
  return {
    type: 'UPDATE_SELECTED_SLOT',
    payload: {
      selectedSlot: event
    }
  }
}

export const updateSelectedEvent = (event) => {
  return {
    type: 'UPDATE_SELECTED_EVENT',
    payload: {
      selectedEvent: event
    }
  }
}

// export const addEvent = event => {
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