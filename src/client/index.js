import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/createStore';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import { baseURL } from '../config/appConfig';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

let basename = undefined;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  basename = baseURL;
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
