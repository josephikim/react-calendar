import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

import userReducer from './userSlice';

const doCreateStore = () => {
  const persistedState = loadState();

  const preloadedState = persistedState ?? {};

  const allReducers = combineReducers({
    user: userReducer
  });

  const rootReducer = (state, action) => {
    if (action.type === 'user/userLoggedOut') {
      state = undefined;
    }

    return allReducers(state, action);
  };

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
