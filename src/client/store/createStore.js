import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import appReducer from '../reducers';

const middleware = [
  thunk,
];

const initialState = {
  auth: {
    authenticatedUser: '',
    isLoading: false
  },
  user: {
    events: [],
    selectedSlot: {
      start: new Date(),
      end: new Date(),
    },
    selectedEvent: {},
    calendars: {}
  }
}

const doCreateStore = () => {
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(appReducer, initialState, composeEnhancers(
    applyMiddleware(...middleware)
  ));

  return store;
}

export default doCreateStore();