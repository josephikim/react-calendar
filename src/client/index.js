import React from 'react';
import ReactDOM from 'react-dom';
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './App';
import appReducer from './reducers';

import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

const middleware = [
  thunk,
];

const initialState = {
  config: {},
  calendar: {
    events: [],
    selectedSlot: {
      start: new Date(),
      end: new Date(),
    }
  }
}

const store = createStore(
  appReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(...middleware)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef  
}