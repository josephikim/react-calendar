import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import store from './store/createStore';
import { Provider } from 'react-redux';

import App from './App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div myprop={process.env.PUBLIC_URL}>process.env.PUBLIC_URL: {process.env.PUBLIC_URL}</div>
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
