import React from 'react';
import ReactDOM from 'react-dom';
import store from 'client/store/createStore';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from 'client/App';
import { baseURL } from 'config/appConfig';

import 'client/index.css';
import 'bootstrap/dist/css/bootstrap.css';

const isProduction = process.env.NODE_ENV === 'production';

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter basename={isProduction ? baseURL : '/'}>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>,
  document.getElementById('root')
);
