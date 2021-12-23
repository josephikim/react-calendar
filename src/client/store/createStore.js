import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import authReducer from './authSlice';
import userReducer from './userSlice';

const middleware = [thunk];

// Set initial calendar slot
let start = new Date();
let end = new Date();
start.setHours(start.getHours() + 1, 0, 0, 0);
end.setHours(end.getHours() + 2, 0, 0, 0);

const initialSlot = {
  action: 'click',
  start: start.toISOString(),
  end: end.toISOString()
};

// Set initial state
const initialState = {
  auth: {
    accessToken: null,
    refreshToken: null
  },
  user: {
    userId: null,
    username: null,
    selectedSlot: initialSlot,
    selectedEvent: {},
    calendars: [],
    calendarEvents: []
  }
};

const doCreateStore = () => {
  const reducer = combineReducers({
    auth: authReducer,
    user: userReducer
  });

  const persistedState = loadState();

  if (persistedState) {
    persistedState.user.selectedSlot = initialState.user.selectedSlot;
    persistedState.user.selectedEvent = initialState.user.selectedEvent;
  }

  const composeEnhancers = composeWithDevTools({});

  const store = createStore(
    reducer,
    persistedState ? persistedState : initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }, 1000)
  );

  return store;
};

export default doCreateStore();
