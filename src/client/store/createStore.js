import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
import authReducer from './authSlice';
import userReducer from './userSlice';

const middleware = [thunk];

// NOTE: Only auth data is persisted via localstorage. User data (eg calendars and events) will be retrieved if needed after store is created
const doCreateStore = () => {
  const allReducers = combineReducers({
    auth: authReducer,
    user: userReducer
  });

  const rootReducer = (state, action) => {
    if (action.type === 'auth/userLoggedOut') {
      state = undefined;
    }

    return allReducers(state, action);
  };

  const composeEnhancers = composeWithDevTools({});

  let persistedState = loadState();

  const store = createStore(
    rootReducer,
    persistedState ? persistedState : undefined,
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
