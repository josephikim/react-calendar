import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import store from './store/createStore';
import { Provider } from 'react-redux';

import App from './App';
import config from '../server/config/appConfig';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

let basename = undefined;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  basename = config.baseURL;
}

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>,
  document.getElementById('root')
);

// Needed for Hot Module Replacement
if (typeof module.hot !== 'undefined') {
  module.hot.accept(); // eslint-disable-line no-undef
}
