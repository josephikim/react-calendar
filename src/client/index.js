import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import appReducer from './reducers';

import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

let store = createStore(appReducer);

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