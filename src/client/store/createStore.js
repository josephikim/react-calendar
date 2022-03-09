import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import authReducer from './authSlice';
import userReducer from './userSlice';
import { defaultView } from '../../server/config/appConfig';

const middleware = [thunk];

// Initial calendar slot
let start = new Date();
let end = new Date();
start.setHours(start.getHours() + 1, 0, 0, 0);
end.setHours(end.getHours() + 2, 0, 0, 0);

const initialSlot = {
  action: 'click',
  start,
  end,
  slots: [start]
};

const initialState = {
  auth: {
    accessToken: null,
    refreshToken: null,
    userId: null
  },
  user: {
    username: null,
    calendarSlotSelection: initialSlot,
    calendarEventSelection: {},
    calendars: [],
    calendarEvents: [],
    calendarViewSelection: defaultView
  }
};

// NOTE: Only auth data is persisted via localstorage. User data (eg calendars and events) will be retrieved if needed after store is created
const doCreateStore = () => {
  const reducer = combineReducers({
    auth: authReducer,
    user: userReducer
  });

  const composeEnhancers = composeWithDevTools({});

  const persistedState = loadState();

  let state = { ...initialState };

  if (persistedState !== undefined && persistedState.accessToken) {
    state.auth = { ...persistedState };
  }

  const store = createStore(reducer, state, composeEnhancers(applyMiddleware(...middleware)));

  store.subscribe(
    throttle(() => {
      const authState = store.getState().auth;

      saveState(authState);
    }, 1000)
  );
  return store;
};

export default doCreateStore();
