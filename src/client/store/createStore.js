import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import appReducer from '../reducers';

let start = new Date();
let end = new Date();
start.setHours(start.getHours(),0,0,0);
end.setHours(start.getHours() + 1,0,0,0);

let initialSlot = {
  action: 'click',
  start,
  end
}

const initialState = {
  auth: {
    accessToken: ''
  },
  user: {
    events: [],
    selectedSlot: JSON.stringify(initialSlot),
    selectedEvent: JSON.stringify({}),
    calendars: {}
  }
}

const middleware = [
  thunk,
];

const doCreateStore = () => {
  const persistedState = loadState();

  // Reset selections to reflect current date
  if (persistedState) {
    persistedState.user.selectedSlot = JSON.stringify(initialSlot)
    persistedState.user.selectedEvent = JSON.stringify({})
  }

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