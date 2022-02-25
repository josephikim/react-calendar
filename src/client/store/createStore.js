import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import authReducer from './authSlice';
import userReducer from './userSlice';
import { defaultView } from '../../server/config/appConfig';

const middleware = [thunk];

// Set initial state
const initialState = {
  auth: {
    accessToken: null,
    refreshToken: null
  },
  user: {
    userId: null,
    username: null,
    calendarSlotSelection: {},
    calendarEventSelection: {},
    calendars: [],
    calendarEvents: [],
    calendarViewSelection: defaultView
  }
};

const doCreateStore = () => {
  const reducer = combineReducers({
    auth: authReducer,
    user: userReducer
  });

  let persistedState = loadState();

  // Reset calendar view to 'month'
  if (persistedState !== undefined && persistedState.user.calendarViewSelection !== 'month') {
    persistedState.user.calendarViewSelection = 'month';
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
