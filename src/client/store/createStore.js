import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

import authReducer from './authSlice';
import userReducer from './userSlice';

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

  const persistedState = loadState();

  const preloadedState = persistedState ? persistedState : {};

  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState
  });

  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }, 1000)
  );

  return store;
};

export default doCreateStore();
