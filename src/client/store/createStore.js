import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import appReducer from '../reducers';

let start = new Date();
let end = new Date();
start.setHours(start.getHours() + 1,0,0,0);
end.setHours(end.getHours() + 2,0,0,0);

let initialSlot = {
  action: 'click',
  start: start.toISOString(),
  end: end.toISOString()
}

const initialState = {
  app: "react-calendar",
  auth: {
    accessToken: ''
  },
  user: {
    events: [],
    selectedSlot: initialSlot,
    selectedEvent: {},
    calendars: {}
  }
}

const middleware = [
  thunk,
];

const doCreateStore = () => {
  let persistedState = loadState();

  const validPersistedState = persistedState.app === 'react-calendar';

  // Reset selections to current date
  if (validPersistedState) {
    persistedState.user.selectedSlot = initialSlot;
    persistedState.user.selectedEvent = {};
  }

  const composeEnhancers = composeWithDevTools({});

  const store = createStore(
    appReducer, 
    validPersistedState ? persistedState : initialState, 
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