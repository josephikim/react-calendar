import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import appReducer from '../reducers';

const middleware = [
  thunk,
];

const initialState = {
  auth: {
    authenticatedUser: ''
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
  const persistedState = loadState();

  const composeEnhancers = composeWithDevTools({});

  const store = createStore(
    appReducer, 
    persistedState ? persistedState : initialState, 
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  );

  store.subscribe(throttle(() => {
    saveState(store.getState());
  }, 1000));

  return store;
}

export default doCreateStore();