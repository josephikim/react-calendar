import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import appReducer from './reducers';
import { devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
import dotenv from 'dotenv';
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

dotenv.config()

let store = createStore(appReducer, devToolsEnhancer());

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