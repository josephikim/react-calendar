import _ from 'lodash';

import { initialState as userInitialState } from './userSlice';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }

    const json = JSON.parse(serializedState);
    const isUserStateValid = _.isEqual(Object.keys(json.user), Object.keys(userInitialState));
    const isRootStateValid = _.isEqual(Object.keys(json).sort(), ['user']);

    if (!isUserStateValid || !isRootStateValid) {
      return undefined;
    } else {
      return json;
    }
  } catch (e) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    Promise.reject(e);
  }
};
