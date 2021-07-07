import { combineReducers } from 'redux';

import { authReducer } from './authReducer';
import { userReducer } from './userReducer';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

export default appReducer;